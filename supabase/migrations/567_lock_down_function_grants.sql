-- 567_lock_down_function_grants.sql — close the client-callable money / queue / admin RPCs
-- (audit 2026-09-27, AUDIT_2026-09-27.md S2/S3 criticals). 2026-09-27.
--
-- ROOT CAUSE. pg_default_acl gives anon + authenticated an explicit EXECUTE on every new
-- function in `public`, AND Postgres grants EXECUTE to PUBLIC by default. Earlier "fixes"
-- revoked one side only (492 revoked `FROM authenticated, anon` → PUBLIC's `=X` kept it
-- callable; 158/273/484 revoked `FROM PUBLIC` → the explicit anon/authenticated grants kept
-- it callable). Live, every SECURITY DEFINER function was callable by any signed-in user
-- (most by anon), including:
--   spend_sparkles     no p_amount > 0 check → p_amount = -1e6 ADDS a million sparkles
--   refund_sparkles    refund any finished dream you paid for, keep the image
--   claim_dream_queue_job / dream_forensics   signed-out caller stalls the queue and
--                      reads other users' job payloads, prompts and briefs
--   finalize_nightly_upload   rewrite any post's bot message (+ ALTER TABLE lock)
--   activate_announcement, enqueue_nightly_dreams, claim_upscale_job, prune_*, ...
--
-- THE FIX.
--   1. Every SECURITY DEFINER function the app, the website and user-executed SQL (RLS
--      policies, views, CHECKs, defaults, index expressions, non-definer trigger bodies,
--      invoker functions they call) never call: EXECUTE revoked from PUBLIC, anon and
--      authenticated. service_role keeps its explicit grant, so edge functions and
--      scripts (service key) and pg_cron (owner) are unaffected. The list below was
--      computed from the live catalog + a grep of app/, components/, hooks/, lib/,
--      store/, constants/ and ../dreambot-web (2026-09-27); none of these names appear
--      in client code.
--   2. New functions no longer get EXECUTE for anon/authenticated/PUBLIC by default.
--      A migration that adds a client RPC must GRANT it explicitly (CLAUDE.md hard rule;
--      locked by __tests__/lib/functionGrantGuard.test.ts).
--   3. Guards inside the bodies (defence in depth): spend_sparkles rejects p_amount <= 0;
--      finalize_nightly_upload is service-role only and no longer takes an ACCESS
--      EXCLUSIVE lock (the freeze trigger already lets service_role through);
--      approve_follow_request / approve_follow_and_follow_back require a pending request
--      and refuse a blocked pair; get_notification_settings answers for yourself only;
--      get_bot_thumbnails hides private bots from everyone but their owner and admins.
--   4. Clients lose table INSERT/UPDATE/DELETE on sparkle_transactions, engine_config and
--      dream_queue (RLS already denied them; the app only reads these).
--   5. The nightly kill switch (engine_config.nightly_enabled) now also stops the hourly
--      pg_cron backstop, which called enqueue_nightly_dreams unconditionally.

-- ── 1. Revoke client EXECUTE on server-only SECURITY DEFINER functions ─────────────────
DO $$
DECLARE
  r record;
  v_names text[] := ARRAY[
    'accept_invite', 'activate_announcement', 'admin_db_connections', 'admin_unban_user',
    'advance_expired_dream_offs', 'advance_phase', 'cancel_game',
    'cancel_pending_download_push', 'cancel_pending_dream_push', 'capture_db_health',
    'cast_votes', 'category_enabled_for', 'charge_sparkles', 'claim_dream_queue_job',
    'claim_first_dream_ip', 'claim_upscale_job', 'create_game', 'deal_topic',
    'describe_album_impact', 'drain_pending_push_groups', 'dream_forensics',
    'dream_forensics_recent', 'dream_off_donate', 'dream_off_fund_pot',
    'dream_off_gen_invite_code', 'dream_off_setup_pot', 'enqueue_nightly_dreams',
    'fetch_nightly_history', 'finalize_nightly_upload', 'get_client_flags',
    'get_dream_off_packs', 'get_game_activity', 'get_game_gallery', 'get_game_players',
    'get_game_results', 'get_game_room', 'get_my_ballot', 'get_my_games',
    'get_unread_group_count', 'get_unread_notification_count', 'invite_players',
    'join_game_by_code', 'leave_game', 'maybe_advance_dream_off', 'prune_activity_logs',
    'reconcile_sparkles', 'refund_sparkles', 'reroll_topic', 'spend_sparkles',
    'tally_results', 'text_is_blocked'
  ];
BEGIN
  FOR r IN
    SELECT format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid)) AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = ANY (v_names)
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;

-- ── 2. New functions: no implicit client EXECUTE ──────────────────────────────────────
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

-- ── 3. Guards in the bodies ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.spend_sparkles(
  p_user_id uuid, p_amount integer, p_reason text, p_reference_id uuid DEFAULT NULL::uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_balance integer;
  v_after integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot spend sparkles for a different user';
  END IF;
  -- A negative amount would ADD sparkles (balance - (-N)); zero is a no-op ledger row.
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'spend_sparkles: p_amount must be positive (got %)', p_amount;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  SELECT sparkle_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;
  IF v_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance - p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, -p_amount, p_reason, p_reference_id, v_after);

  RETURN true;
END;
$function$;

-- The freeze trigger (freeze_upload_columns_on_update) already lets service_role through,
-- so no trigger toggling: ALTER TABLE ... DISABLE TRIGGER took an ACCESS EXCLUSIVE lock on
-- uploads (blocking every feed read) on every nightly.
CREATE OR REPLACE FUNCTION public.finalize_nightly_upload(
  p_upload_id uuid, p_bot_message text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF current_setting('role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'finalize_nightly_upload is server-only';
  END IF;
  UPDATE public.uploads SET bot_message = p_bot_message WHERE id = p_upload_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.approve_follow_request(p_requester_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  -- Only a real pending request can be approved (this runs as the owner, so it skips the
  -- follows RLS; without this check anyone could force any account to follow them).
  IF NOT EXISTS (
    SELECT 1 FROM public.follow_requests
    WHERE requester_id = p_requester_id AND target_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'no_follow_request';
  END IF;
  IF public.block_exists(auth.uid(), p_requester_id) THEN
    DELETE FROM public.follow_requests
    WHERE requester_id = p_requester_id AND target_id = auth.uid();
    RETURN;
  END IF;

  INSERT INTO public.follows (follower_id, following_id)
  VALUES (p_requester_id, auth.uid())
  ON CONFLICT DO NOTHING;

  DELETE FROM public.follow_requests
  WHERE requester_id = p_requester_id AND target_id = auth.uid();

  INSERT INTO public.notifications (recipient_id, actor_id, type, body)
  VALUES (p_requester_id, auth.uid(), 'follow_accepted', NULL);
END;
$function$;

CREATE OR REPLACE FUNCTION public.approve_follow_and_follow_back(p_requester_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.follow_requests
    WHERE requester_id = p_requester_id AND target_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'no_follow_request';
  END IF;
  IF public.block_exists(auth.uid(), p_requester_id) THEN
    DELETE FROM public.follow_requests
    WHERE requester_id = p_requester_id AND target_id = auth.uid();
    RETURN;
  END IF;

  -- Approve: requester follows target (me)
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (p_requester_id, auth.uid())
  ON CONFLICT DO NOTHING;

  -- Follow back: I follow the requester
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (auth.uid(), p_requester_id)
  ON CONFLICT DO NOTHING;

  -- Remove the request
  DELETE FROM public.follow_requests
  WHERE requester_id = p_requester_id AND target_id = auth.uid();

  -- Notify the requester
  INSERT INTO public.notifications (recipient_id, actor_id, type, body)
  VALUES (p_requester_id, auth.uid(), 'follow_accepted', NULL);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_notification_settings(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Your own settings only (the server reads anyone's with the service key).
  IF current_setting('role', true) IS DISTINCT FROM 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: notification settings are private';
  END IF;
  RETURN jsonb_build_object(
    'push_paused', coalesce(
      (SELECT push_paused FROM public.notification_settings WHERE user_id = p_user_id),
      false
    ),
    'prefs', coalesce((
      SELECT jsonb_object_agg(category || '|' || channel, enabled)
      FROM public.notification_preferences
      WHERE user_id = p_user_id
    ), '{}'::jsonb)
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_bot_thumbnails(p_per_bot integer DEFAULT 3)
RETURNS TABLE(bot_user_id uuid, thumbnail_urls text[])
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT
    u.id AS bot_user_id,
    COALESCE(
      ARRAY(
        SELECT up.image_url
        FROM public.uploads up
        WHERE up.user_id = u.id
          AND up.image_url IS NOT NULL
          AND up.is_public = true
        ORDER BY up.created_at DESC
        LIMIT p_per_bot
      ),
      '{}'::text[]
    ) AS thumbnail_urls
  FROM public.users u
  WHERE u.is_bot = true
    -- Private bots (AlphaBot, OutlawBot) stay invisible to everyone but admins.
    AND (
      u.is_public
      OR EXISTS (SELECT 1 FROM public.users a WHERE a.id = auth.uid() AND a.is_admin)
    );
$function$;

-- The replaced functions keep their earlier grants (CREATE OR REPLACE does not reset
-- ACLs); restate the intended ones so this file is the record.
REVOKE ALL ON FUNCTION public.spend_sparkles(uuid, integer, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_sparkles(uuid, integer, text, uuid) TO service_role;
REVOKE ALL ON FUNCTION public.finalize_nightly_upload(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_nightly_upload(uuid, text) TO service_role;
REVOKE ALL ON FUNCTION public.approve_follow_request(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_follow_request(uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.approve_follow_and_follow_back(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_follow_and_follow_back(uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.get_notification_settings(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_notification_settings(uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.get_bot_thumbnails(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_bot_thumbnails(integer) TO authenticated, service_role;

-- ── 4. Clients only read these tables ─────────────────────────────────────────────────
REVOKE INSERT, UPDATE, DELETE ON public.sparkle_transactions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.engine_config FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.dream_queue FROM anon, authenticated;

-- ── 5. The nightly kill switch also stops the pg_cron backstop ────────────────────────
SELECT cron.alter_job(
  job_id := j.jobid,
  command := $cmd$ SELECT public.enqueue_nightly_dreams(false) WHERE COALESCE((SELECT nightly_enabled FROM public.engine_config WHERE id = 1), true); $cmd$
)
FROM cron.job j
WHERE j.jobname = 'nightly-enqueue-backstop';
