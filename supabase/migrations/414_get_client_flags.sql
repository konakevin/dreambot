-- 414_get_client_flags.sql (2026-07-26)
--
-- Dream Off — Stage C support (DREAM_OFF_BUILD_PLAN.md §0 verification item). The
-- client cannot read engine_config directly (service-role-only), so it needs a
-- narrow, safe RPC to learn which dark-launched features are live. get_client_flags
-- exposes ONLY the client-relevant feature flags — today just dream_off_enabled —
-- so the app can gate all Dream Off UI at runtime (born dark until the flag flips).
--
-- Granted to anon + authenticated: a logged-out invite-link tap needs to know
-- whether the feature is on to show the right landing state. It's a boolean feature
-- flag, not sensitive. SECURITY DEFINER + search_path=''. Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.get_client_flags()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'dream_off_enabled', COALESCE((SELECT dream_off_enabled FROM public.engine_config WHERE id = 1), false)
  );
$$;
GRANT EXECUTE ON FUNCTION public.get_client_flags() TO anon, authenticated;

COMMIT;
