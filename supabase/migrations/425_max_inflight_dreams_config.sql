-- 425: per-user in-flight dream cap → engine_config (live-tunable) + client-facing.
--
-- The cap on how many dreams one user can have queued/rendering at once was a
-- hardcoded MAX_INFLIGHT_PER_USER=5 in the enqueue-dream edge fn. Move it to
-- engine_config so we can dial it (3 ↔ 5 ↔ N) from the dashboard with NO app
-- build, and return it from get_engine_config() so the Create screen can
-- pre-empt the cap with a friendly message (instead of a doomed loading screen).
--
-- Safe either order: enqueue-dream reads engine_config via select('*') and
-- get_engine_config falls back client-side, both defaulting to 5 if the column
-- is somehow missing. Run in the Supabase dashboard SQL editor.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS max_inflight_dreams_per_user integer NOT NULL DEFAULT 5;

-- Extend get_engine_config() — verbatim the migration-341 field set PLUS the new
-- cap. RETURNS jsonb (unchanged shape family) so CREATE OR REPLACE is safe.
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
    'new_scene_price_best',     new_scene_price_best,
    'max_inflight_dreams_per_user', max_inflight_dreams_per_user
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;
