-- 343_notify_on_complete_catchup.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Close the "fast dream never pings you" race.
--
-- The render decides whether to send the dream_generated notification ONCE, at
-- completion, by reading dream_jobs.notify_on_complete. That flag is set by
-- request_dream_notification when the user leaves/queues. For a fast render
-- (New Scene lands in ~13-23s) the render finishes and reads `false` BEFORE the
-- leave-action sets the flag → no ping. Setting it afterward did nothing (the
-- render already decided). New Scene just exposed this; it hits every fast dream.
--
-- Fix: make request_dream_notification "ensure notified" — it sets the flag AND,
-- if the dream is ALREADY done, inserts the completion notification right then
-- (the catch-up the render missed). Whoever wins the race, the user gets exactly
-- ONE ping, enforced by a partial unique index + ON CONFLICT DO NOTHING on both
-- insert sites (the render now routes through the same helper).
--
-- Suppression preserved: a user who WAITS on the loading screen never calls
-- request_dream_notification, so neither the flag nor the catch-up fires → no
-- push. Only a leaver/queuer triggers it. Unchanged.
-- ─────────────────────────────────────────────────────────────────────────

-- ── 1. De-dupe any existing double dream_generated rows, then enforce one ────
-- Keep the earliest (created_at, id) per upload; drop the rest. A duplicate
-- completion notification is junk (two "your dream is ready" for one dream).
-- Scoped to subtype='manual' — the CREATE-flow completion pings (generate-dream
-- + restyle-photo). Nightly dreams also use type='dream_generated' but no
-- subtype and are automated (never queued/left), so they're intentionally
-- exempt from this one-per-upload constraint.
DELETE FROM public.notifications a
USING public.notifications b
WHERE a.type = 'dream_generated'
  AND b.type = 'dream_generated'
  AND a.subtype = 'manual'
  AND b.subtype = 'manual'
  AND a.upload_id IS NOT NULL
  AND a.upload_id = b.upload_id
  AND (a.created_at, a.id) > (b.created_at, b.id);

CREATE UNIQUE INDEX IF NOT EXISTS notifications_dream_generated_manual_uniq
  ON public.notifications (upload_id)
  WHERE type = 'dream_generated' AND subtype = 'manual';

-- ── 2. Idempotent completion-notification insert (the ONE insert site) ───────
-- Both the render (service_role) and the catch-up (below) go through this, so
-- the unique index makes a double-notify impossible. NOT granted to
-- authenticated (no client-forged pings) — only service_role + the SECURITY
-- DEFINER caller below can reach it.
CREATE OR REPLACE FUNCTION public.ensure_dream_generated_notification(
  p_upload_id uuid,
  p_user_id uuid,
  p_body text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  INSERT INTO public.notifications (recipient_id, actor_id, type, subtype, upload_id, body)
  VALUES (p_user_id, p_user_id, 'dream_generated', 'manual', p_upload_id, p_body)
  ON CONFLICT (upload_id) WHERE type = 'dream_generated' AND subtype = 'manual' DO NOTHING;
$$;
REVOKE ALL ON FUNCTION public.ensure_dream_generated_notification(uuid, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.ensure_dream_generated_notification(uuid, uuid, text) TO service_role;

-- ── 3. request_dream_notification: set the flag + CATCH UP if already done ───
CREATE OR REPLACE FUNCTION public.request_dream_notification(p_job_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_upload uuid;
  v_medium text;
  v_vibe text;
BEGIN
  -- Flag upsert (migration 195 behavior): pre-create the row if the server
  -- hasn't inserted it yet, else flip the flag — guarded to the caller's jobs.
  INSERT INTO public.dream_jobs (id, user_id, status, notify_on_complete)
  VALUES (p_job_id, v_uid, 'processing', true)
  ON CONFLICT (id) DO UPDATE
    SET notify_on_complete = true
    WHERE public.dream_jobs.user_id = v_uid;

  -- Catch-up: if the render ALREADY finished (it read notify_on_complete before
  -- we set it), it never pinged. Send it now. Idempotent via ensure_*.
  SELECT upload_id, result_medium, result_vibe
    INTO v_upload, v_medium, v_vibe
    FROM public.dream_jobs
   WHERE id = p_job_id
     AND user_id = v_uid
     AND status = 'done'
     AND upload_id IS NOT NULL;

  IF v_upload IS NOT NULL THEN
    PERFORM public.ensure_dream_generated_notification(
      v_upload,
      v_uid,
      coalesce(v_medium, 'surprise') || ' · ' || coalesce(v_vibe, 'surprise')
    );
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.request_dream_notification(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.request_dream_notification IS
  'Opt a dream into its dream_generated notification (loading-screen Queue/leave). Sets notify_on_complete AND, if the render already finished before the flag landed, sends the completion notification now (catch-up, migration 343) — idempotent via ensure_dream_generated_notification + the partial unique index. A user who waits on the loading screen never calls this, so waiters are still not pinged.';
