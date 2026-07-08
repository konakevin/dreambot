-- 341_new_scene_config.sql (2026-07-08)
--
-- New Scene (uploaded-photo reference path) config, per NEW_SCENE_QUALITY_PLAN.md:
--   * new_scene_max_people   — the group-size cap. Bench-set to 3 (2 & 3 preserve
--     everyone; 4 reinvents; 7 collapses). Over the cap, the client blocks New
--     Scene pre-charge and steers to Restyle. Tunable from the dashboard.
--   * new_scene_price_standard / _best — the flat tier prices (sparkles). Price is
--     decoupled from the model so the engine can route freely; the client shows
--     these before upload and the server charges by a validated tier enum (never a
--     client-supplied force_model on this path).
--
-- get_engine_config() gains the three fields (RETURNS jsonb, same shape contract,
-- so CREATE OR REPLACE is safe — same pattern as migrations 312 / 335).

BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS new_scene_max_people    int NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS new_scene_price_standard int NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS new_scene_price_best     int NOT NULL DEFAULT 5;

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
    'latest_app_version',       latest_app_version,
    'gifting_enabled',          gifting_enabled,
    'gift_max_per_send',        gift_max_per_send,
    'gift_max_per_day',         gift_max_per_day,
    'gift_message_max_len',     gift_message_max_len,
    'new_scene_max_people',     new_scene_max_people,
    'new_scene_price_standard', new_scene_price_standard,
    'new_scene_price_best',     new_scene_price_best
  )
  FROM public.engine_config
  WHERE id = 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;

COMMIT;
