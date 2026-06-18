-- 278_security_hardening.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Security-audit hardening (2026-06-17). Five independent fixes, all
-- backward-compatible with installed app builds (no client read/write that
-- exists today is broken by this migration):
--
--   H4  Hide users.email (PII) from the anon + authenticated PostgREST roles.
--       A column-level SELECT grant (all columns EXCEPT email). The RLS row
--       policy ("Users visible unless blocked") let any logged-in — or even
--       anonymous — caller read every non-blocking user's email via a raw
--       `/users?select=email` query. The client never reads email, so this is
--       invisible to the app. (The economic columns — sparkle_balance / pro_* /
--       is_admin — stay readable cross-user for now: the client reads them for
--       SELF directly, so hiding them needs an RPC + a new app build first.
--       Tracked separately.)
--
--   H5  Block clients from forging uploads engagement counters (like_count,
--       comment_count, repost_count, save_count, share_count, view_count) to
--       game the feed ranking. A column-level UPDATE grant (all columns EXCEPT
--       the 6 counters). The counters are maintained ONLY by SECURITY DEFINER
--       triggers (owned by postgres → bypass the column grant), so legit
--       increments keep working; a direct client PATCH of a counter now errors.
--
--   H7  refund_sparkles: add the caller auth-guard the other sparkle RPCs have
--       (service_role OR self), and refund ONLY the actual recorded spend —
--       closing the "fresh random reference_id mints +1 sparkle" faucet.
--
--   H8  Per-user insert rate limits on likes + post_reposts (reuses migration
--       194's enforce_insert_rate_limit). Stops like/unlike + repost loops that
--       spam a victim's notification/push pipeline.
--
--   M11 Enable RLS (service-role-only) on config/vestigial tables that were
--       left world-writable via PostgREST: recipe_registry, feature_flags,
--       rank_thresholds, dual_scenarios, single_scenarios.
--
-- NOTE (H4/H5 footgun): column-level grants do NOT auto-include columns added
-- later. A future users/uploads column is NOT client-readable/updatable until
-- it gets its own GRANT here. That is a safe-by-default posture, but remember
-- it when adding columns.
-- ─────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- H4 — users.email column lockdown
-- ═══════════════════════════════════════════════════════════════════════════
-- Postgres can't subtract one column from a table-level grant, so revoke the
-- table SELECT and re-grant column-level on everything EXCEPT email. Service
-- role keeps its own (separate) grant; SECURITY DEFINER RPCs (get_public_profile,
-- get_feed) run as the owner and are unaffected.
REVOKE SELECT ON public.users FROM anon, authenticated;

GRANT SELECT (
  id, username, display_name, avatar_url, bio, is_public, is_bot, created_at,
  has_ai_recipe, username_confirmed, allow_reposts, dreams_private_only,
  pro_mode_flux_model, last_active_at, last_inbox_view_at,
  first_dream_completed_at, is_admin, sparkle_balance,
  pro_subscription, pro_subscription_expires_at, pro_subscription_will_renew,
  pro_trial_started_at, basic_subscription, basic_subscription_expires_at
) ON public.users TO anon, authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- H5 — uploads engagement-counter lockdown
-- ═══════════════════════════════════════════════════════════════════════════
-- One counter trigger (repost) was SECURITY INVOKER; the other five are DEFINER.
-- Make it DEFINER too so the counter UPDATE always runs as the owner and bypasses
-- the column grant below, regardless of whether the repost came via toggle_repost
-- (RPC) or a direct post_reposts insert.
CREATE OR REPLACE FUNCTION public.update_repost_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads SET repost_count = repost_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Revoke table UPDATE, re-grant column-level on everything EXCEPT the 6
-- denormalized counters (like_count, comment_count, repost_count, save_count,
-- share_count, view_count). anon never legitimately updates uploads (RLS already
-- blocks it), so it gets no UPDATE grant at all. The existing freeze trigger
-- still guards the other sensitive columns (user_id, is_approved, …) for the
-- granted set.
REVOKE UPDATE ON public.uploads FROM anon, authenticated;

GRANT UPDATE (
  ai_concept, ai_prompt, bot_message, caption, categories, created_at,
  description, dream_medium, dream_vibe, flux_seed, from_wish, height, id,
  image_url, image_url_display, image_url_hq, image_url_hq_generated_at,
  is_active, is_ai_generated, is_approved, is_moderated, is_posted, is_public,
  media_type, model, output_hash, output_phash, posted_at, recipe, recipe_id,
  search_tsv, style_summary, thumbhash, thumbnail_url, user_id, width
) ON public.uploads TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- H7 — refund_sparkles: caller guard + refund-actual-spend-only
-- ═══════════════════════════════════════════════════════════════════════════
-- Two changes vs migration 185:
--   1. Add the caller auth-guard charge_sparkles already has — a non-service
--      caller can only refund to themselves (was missing → a client could
--      refund onto an arbitrary user_id).
--   2. Refund ONLY the actual recorded spend for the reference_id; drop the
--      `p_amount` fallback. Previously a reference_id with NO prior debit
--      refunded p_amount (=1) anyway, so refund-self-moderation could mint +1
--      sparkle per fresh random job_id. Now: no debit → nothing to refund.
-- Signature unchanged → CREATE OR REPLACE is safe (no return-type change).
CREATE OR REPLACE FUNCTION public.refund_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_existing integer;
  v_spent integer;
  v_refund integer;
  v_after integer;
BEGIN
  -- Only the service role (server-side refund flows) or the user themselves may
  -- trigger a refund. Mirrors charge_sparkles / spend_sparkles / grant_sparkles.
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot refund sparkles for a different user';
  END IF;

  -- Idempotent: a prior refund for this reference_id wins.
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND reason LIKE 'refund:%';
  IF v_existing > 0 THEN
    RETURN false;
  END IF;

  -- Refund ONLY what was actually charged under this reference_id. No fallback
  -- to p_amount — a reference_id with no debit refunds nothing (closes the
  -- self-moderation 1-sparkle faucet).
  SELECT -COALESCE(SUM(amount), 0) INTO v_spent
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND amount < 0;

  v_refund := GREATEST(v_spent, 0);
  IF v_refund <= 0 THEN
    RETURN false;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;
  UPDATE public.users SET sparkle_balance = sparkle_balance + v_refund
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, v_refund, p_reason, p_reference_id, v_after);

  RETURN true;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
-- H8 — per-user insert rate limits on likes + reposts
-- ═══════════════════════════════════════════════════════════════════════════
-- Reuses migration 194's generic enforce_insert_rate_limit(max, window, col).
-- Likes/reposts fire notification → push triggers, so an unbounded like/unlike
-- or repost loop spams a victim. 60/min is far above any human; it stops scripts.
CREATE INDEX IF NOT EXISTS idx_likes_user_created
  ON public.likes (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_post_reposts_reposter_created
  ON public.post_reposts (reposter_id, created_at);

DROP TRIGGER IF EXISTS trg_rate_limit_likes ON public.likes;
CREATE TRIGGER trg_rate_limit_likes
  BEFORE INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('60', '1 minute', 'user_id');

DROP TRIGGER IF EXISTS trg_rate_limit_post_reposts ON public.post_reposts;
CREATE TRIGGER trg_rate_limit_post_reposts
  BEFORE INSERT ON public.post_reposts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('60', '1 minute', 'reposter_id');


-- ═══════════════════════════════════════════════════════════════════════════
-- M11 — enable RLS (service-role-only) on config / vestigial tables
-- ═══════════════════════════════════════════════════════════════════════════
-- These had RLS disabled, so the Supabase default grants let anon/authenticated
-- read AND write them via PostgREST. None are read by the client (edge functions
-- use the service role, which bypasses RLS). Enable RLS with NO permissive
-- policy = deny all client access; service role is unaffected.
--   • recipe_registry  — vestigial per-user recipe snapshots (live data is in
--                        the RLS-locked user_recipes); holds user_id + recipe.
--   • feature_flags    — client-driven behavior flips if writable.
--   • rank_thresholds  — legacy rad/bad voting (dead).
--   • dual_scenarios / single_scenarios — nightly scene pools (creative config).
-- Guarded with to_regclass: some of these are old/vestigial and may already be
-- dropped (recipe_registry was) — skip a missing table instead of aborting.
DO $$ BEGIN
  IF to_regclass('public.recipe_registry') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.recipe_registry ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.feature_flags') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.rank_thresholds') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.rank_thresholds ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.dual_scenarios') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.dual_scenarios ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.single_scenarios') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.single_scenarios ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;
