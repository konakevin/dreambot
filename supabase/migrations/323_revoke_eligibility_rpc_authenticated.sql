-- 323 — Stop leaking any user's Pro/Basic/admin status (2026-07-01 audit, S3
-- MEDIUM). is_pro_active / is_basic_active / is_dream_eligible are SECURITY
-- DEFINER and were GRANTed EXECUTE to `authenticated`, so any logged-in user
-- could POST /rest/v1/rpc/is_pro_active {"p_user_id":"<victim>"} and read the
-- exact entitlement/admin state that migration 280 revoked at the column level.
--
-- These functions are only called SERVER-SIDE (edge fns + crons run as
-- service_role, which bypasses EXECUTE grants). Verified: no client/hook calls
-- them (they read their own state via get_my_account(), migration 280). So
-- revoking the `authenticated` grant closes the probe with zero client impact.

REVOKE EXECUTE ON FUNCTION public.is_pro_active(uuid) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.is_basic_active(uuid) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.is_dream_eligible(uuid) FROM authenticated, anon;
