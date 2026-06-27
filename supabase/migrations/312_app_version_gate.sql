-- 312_app_version_gate.sql — DB-driven "update your app" gate.
--
-- Lets us force (or softly nudge) an app update from the dashboard with NO App
-- Store build: set the version string on engine_config and every running app
-- picks it up within the get_engine_config cache window (~5 min).
--
--   min_app_version    — HARD gate. If the running app's marketing version is
--                        BELOW this, it shows a blocking, non-dismissible
--                        "Update Required" screen. Use for a release that
--                        breaks older clients (schema/API change). NULL = off.
--   latest_app_version — SOFT nudge. If the app is below this (but at/above min),
--                        it shows a DISMISSIBLE "Update available" prompt. NULL = off.
--
-- Both are plain marketing versions ('1.2.0') compared with semver semantics by
-- the client (lib/appVersion.ts). The client FAILS OPEN: a null, blank, or
-- malformed value never gates — so a dashboard typo can't brick the fleet.
--
-- To arm a hard gate from the Supabase SQL editor:
--   UPDATE public.engine_config SET min_app_version = '1.2.0' WHERE id = 1;
-- To disarm:
--   UPDATE public.engine_config SET min_app_version = NULL WHERE id = 1;
--
-- Run in the Supabase dashboard SQL editor. Idempotent.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS min_app_version text,
  ADD COLUMN IF NOT EXISTS latest_app_version text;

-- get_engine_config() — surface the two version fields to the client gate.
-- RETURNS jsonb (unchanged shape), so CREATE OR REPLACE is safe (no DROP).
CREATE OR REPLACE FUNCTION public.get_engine_config()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'base_sparkle_cost',        base_sparkle_cost,
    'welcome_sparkle_bonus',    welcome_sparkle_bonus,
    'pro_trial_days',           pro_trial_days,
    'prompt_max_length',        prompt_max_length,
    'photo_preprocess_width',   photo_preprocess_width,
    'photo_preprocess_quality', photo_preprocess_quality,
    'self_ref_regex',           self_ref_regex,
    'relationship_regex',       relationship_regex,
    'relationship_words',       relationship_words,
    'pet_words',                pet_words,
    'min_app_version',          min_app_version,
    'latest_app_version',       latest_app_version
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;
