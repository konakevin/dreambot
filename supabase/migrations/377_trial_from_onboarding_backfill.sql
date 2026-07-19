-- 377: Anchor the free trial to ONBOARDING completion, not signup — backfill.
--
-- The 14-day Pro-features trial is `pro_trial_started_at + engine_config.pro_trial_days`,
-- read identically by lib/proStatus.ts, scripts/lib/nightlyEligibility.js, and the
-- is_pro_active() SQL fn. But `pro_trial_started_at` was set at SIGNUP (the users
-- INSERT trigger, migration 176) — so a user who signs up and then delays onboarding
-- burned trial days before ever using the app (Kevin 2026-07-18: kathryn signed up
-- 07-05, onboarded 07-16 → only ~3 of 14 days left). Intended: the user gets the full
-- trial (14 nightly dreams) starting when onboarding COMPLETES.
--
-- Going forward: enqueue-dream resets pro_trial_started_at = now() at the first_dream
-- enqueue (the onboarding cutoff, runs once per account). This migration BACKFILLS
-- existing users the same way, using their first_dream enqueue time as the
-- onboarding-completion moment.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable (it only ever moves the
-- trial start FORWARD, and after the first run onboarded_at == pro_trial_started_at
-- so the `>` guard makes a second run a no-op).

BEGIN;

-- pro_trial_started_at is a FROZEN column (migration 281): a plain UPDATE would be
-- silently reverted by freeze_user_columns_on_update(). Service-role writes bypass
-- it; a hand-run migration is the `postgres` role, so opt in via the bypass GUC the
-- trigger checks.
SET LOCAL app.bypass_user_freeze = 'true';

UPDATE public.users u
SET pro_trial_started_at = onb.onboarded_at
FROM (
  SELECT user_id, min(created_at) AS onboarded_at
  FROM public.dream_queue
  WHERE source = 'first_dream'
  GROUP BY user_id
) onb
WHERE onb.user_id = u.id
  -- Only late-onboarders, and ONLY move the trial start FORWARD (never earlier).
  -- Immediate onboarders shift by the few seconds between signup and first_dream —
  -- harmless and correct (trial now runs from onboarding).
  AND onb.onboarded_at > u.pro_trial_started_at;

COMMIT;

-- NOTE: old-flow accounts (created before the first_dream onboarding flow, e.g. the
-- March/April signups) have no source='first_dream' row and are left untouched —
-- their trials expired months ago, so re-anchoring is moot. Verify the effect with:
--   SELECT username, created_at, pro_trial_started_at,
--          pro_trial_started_at + (SELECT pro_trial_days FROM engine_config) * interval '1 day' AS trial_ends
--   FROM public.users WHERE pro_trial_started_at IS NOT NULL ORDER BY created_at DESC;
