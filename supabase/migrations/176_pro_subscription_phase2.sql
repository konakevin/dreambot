-- 176_pro_subscription_phase2.sql
--
-- Pro subscription Phase 2: HQ download abuse cap, 14-day Pro-features
-- trial for new users, and helper function to check Pro access including
-- the trial window.
--
-- Changes:
--   1. pro_hq_downloads_log table — every Pro HQ save logged, used by
--      upscale-image Edge Function to enforce the 500/month soft cap.
--   2. users.pro_trial_started_at column — set on signup via trigger;
--      grants 14 days of Pro-equivalent perks.
--   3. is_pro_active(user_id) function — single authoritative check for
--      "does this user have Pro perks right now?". Used by all Pro-gated
--      Edge Functions (upscale-image, nightly-dreams, generate-dream
--      pre-upscale gate, etc.).
--   4. Trigger that sets pro_trial_started_at on new user INSERTs so
--      trial activates automatically without client-side coordination.

-- ── 1. pro_hq_downloads_log ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pro_hq_downloads_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id   uuid REFERENCES public.uploads(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for the per-user / per-month count used by the rate-limit check.
CREATE INDEX IF NOT EXISTS pro_hq_downloads_log_user_month_idx
  ON public.pro_hq_downloads_log (user_id, created_at DESC);

ALTER TABLE public.pro_hq_downloads_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own download history (for future "download stats"
-- UI). Inserts are service-role only (Edge Function writes after
-- successful upscale).
CREATE POLICY pro_hq_downloads_log_select_own
  ON public.pro_hq_downloads_log
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.pro_hq_downloads_log IS
  'One row per Pro HQ download. upscale-image counts current-month rows and rejects requests beyond PRO_HQ_DOWNLOADS_PER_MONTH (500) to block bot/scraper abuse without affecting real users.';

-- ── 2. users.pro_trial_started_at ──────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pro_trial_started_at timestamptz;

COMMENT ON COLUMN public.users.pro_trial_started_at IS
  'Timestamp the user activated their 14-day Pro-features free trial. Set automatically on signup via trigger. NULL means the user predates the trial system (legacy accounts).';

-- ── 3. is_pro_active(user_id) function ─────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_pro_active(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = p_user_id
      AND (
        -- Paid subscription, not expired
        (u.pro_subscription = true
         AND (u.pro_subscription_expires_at IS NULL
              OR u.pro_subscription_expires_at > now()))
        OR
        -- Within 14-day trial window
        (u.pro_trial_started_at IS NOT NULL
         AND u.pro_trial_started_at > now() - interval '14 days')
      )
  );
$$;

COMMENT ON FUNCTION public.is_pro_active(uuid) IS
  'Single source of truth: does this user have Pro perks RIGHT NOW? Returns true for paid subscribers (active or unexpired) AND for new users within their 14-day trial window. Used by all Pro-gated Edge Functions.';

GRANT EXECUTE ON FUNCTION public.is_pro_active(uuid) TO authenticated;

-- ── 4. Trigger: auto-start trial on new user INSERT ────────────────────

CREATE OR REPLACE FUNCTION public.start_pro_trial_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only set if NULL — otherwise we'd reset trials on UPDATE.
  IF NEW.pro_trial_started_at IS NULL THEN
    NEW.pro_trial_started_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_start_pro_trial_on_signup ON public.users;

CREATE TRIGGER users_start_pro_trial_on_signup
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.start_pro_trial_on_signup();

-- ── 5. Backfill existing users with no trial ──────────────────────────

-- Existing accounts get a fresh 14-day trial starting now. This is a
-- one-time grant so existing users aren't immediately gated behind Pro
-- when this feature rolls out. New accounts after this migration get
-- their trial via the trigger.
UPDATE public.users
SET pro_trial_started_at = now()
WHERE pro_trial_started_at IS NULL;
