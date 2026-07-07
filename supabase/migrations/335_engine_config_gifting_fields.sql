-- 335: Surface the gifting knobs (migration 334) to the client via
-- get_engine_config(). RETURNS jsonb (unchanged shape) so CREATE OR REPLACE
-- is safe — same pattern as migration 312.

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
    'gift_message_max_len',     gift_message_max_len
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;
