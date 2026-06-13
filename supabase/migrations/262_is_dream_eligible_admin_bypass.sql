-- 262_is_dream_eligible_admin_bypass.sql — admins (incl. the super-admin) always
-- get nightly dreams, regardless of subscription state.
--
-- Why: the app owner / admins test in RevenueCat SANDBOX, where subs expire in
-- hours and the webhook re-syncs the real (expired) state — so a manual far-future
-- override gets stomped and the admin silently stops getting nightlies. is_admin
-- is a stable, RevenueCat-independent grant, so bypass the entitlement check for
-- admins. (The supreme-admin account is also is_admin=true, so this covers it.)
--
-- This is the RENDER-TIME re-check used by dream-queue-worker. The matching
-- changes for the enqueue gate (scripts/lib/nightlyEligibility.js) and the client
-- UI (lib/proStatus.ts) ship in the same commit. Return type unchanged (boolean),
-- so CREATE OR REPLACE is fine. Run in the dashboard SQL editor.

CREATE OR REPLACE FUNCTION public.is_dream_eligible(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.is_pro_active(p_user_id)
      OR public.is_basic_active(p_user_id)
      OR EXISTS (
        SELECT 1 FROM public.users u WHERE u.id = p_user_id AND u.is_admin = true
      );
$$;
