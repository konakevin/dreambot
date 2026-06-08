-- 248_is_pro_active_config_trial.sql — make the Pro trial window admin-tunable.
--
-- is_pro_active() is the authoritative server gate for Pro perks (every Pro-gated
-- Edge Function calls it). The trial length was a hardcoded `interval '14 days'`
-- duplicated in three runtimes (this fn, lib/proStatus.ts, nightlyEligibility.js).
-- Per ADMIN_CONFIG_PLAN.md Phase 0 it now reads engine_config.pro_trial_days so an
-- admin can change the trial window from the dashboard with no deploy. COALESCE to
-- 14 keeps behavior identical if the row/column is somehow missing.
--
-- search_path = '' so we fully-qualify public.engine_config. Run in the dashboard.

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
        -- Within the trial window (length from engine_config.pro_trial_days)
        (u.pro_trial_started_at IS NOT NULL
         AND u.pro_trial_started_at > now() - (
              COALESCE((SELECT pro_trial_days FROM public.engine_config WHERE id = 1), 14)
              * interval '1 day'
            ))
      )
  );
$$;

COMMENT ON FUNCTION public.is_pro_active(uuid) IS
  'Single source of truth: does this user have Pro perks RIGHT NOW? Paid (active/unexpired) OR within the trial window (engine_config.pro_trial_days, default 14). Used by all Pro-gated Edge Functions.';

GRANT EXECUTE ON FUNCTION public.is_pro_active(uuid) TO authenticated;
