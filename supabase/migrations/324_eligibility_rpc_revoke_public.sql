-- 324 — Fix 323: the eligibility RPCs were STILL callable by anon after 323.
--
-- ROOT CAUSE: Postgres grants EXECUTE on a function to PUBLIC by DEFAULT.
-- Migration 323 revoked EXECUTE FROM authenticated, anon — but that does NOT
-- remove the implicit PUBLIC grant, so any caller (anon key included) could
-- still POST /rest/v1/rpc/is_pro_active {"p_user_id":"<victim>"} and read the
-- target's Pro/Basic/admin state. Verified live: still callable post-323.
--
-- FIX: revoke from PUBLIC (removes it for everyone) and re-grant to
-- service_role only — the edge functions/crons call these via the service-role
-- key and DO need EXECUTE (service_role bypasses RLS, not function grants).

REVOKE EXECUTE ON FUNCTION public.is_pro_active(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_basic_active(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_dream_eligible(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_pro_active(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_basic_active(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_dream_eligible(uuid) TO service_role;
