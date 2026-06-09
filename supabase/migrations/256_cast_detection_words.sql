-- 256_cast_detection_words.sql — DB-driven cast-detection word lists.
--
-- The self-insert detector (who gets cast/face-swapped into a dream) used to
-- live as TWO hardcoded regexes that drifted: one in the RN client (helper text)
-- and one in the Edge engine (the actual render). "plus one" / "+1" — the app's
-- own term for the second cast member — was in NEITHER, so "show my plus one"
-- rendered a solo self (2026-06-08).
--
-- This makes the RELATIONSHIP + PET word lists a single live source on
-- engine_config. Both runtimes build their regexes from these columns, so adding
-- a word (e.g. a new relationship term) is a one-cell DB edit that fixes the
-- render AND the helper with NO client build and NO edge deploy.
--
-- DEFAULTs below MUST match DEFAULT_RELATIONSHIP_WORDS / DEFAULT_PET_WORDS in
-- supabase/functions/_shared/selfInsertDetector.ts (the code fallback). Strings
-- are regex-source fragments (single backslashes); standard_conforming_strings
-- is on, so backslashes are stored literally.
--
-- Run in the Supabase dashboard SQL editor. Idempotent.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS relationship_words text NOT NULL DEFAULT
    'plus[\s-]?one|plus\s?1|\+\s?1|significant other|partner|wife|husband|girlfriend|boyfriend|gf|bf|spouse|fiancée?|fiancé|fiance|fiancee|friend|best friend|bestie|buddy|bff|pal|mate|mom|mum|dad|mother|father|parent|brother|sister|sibling|twin|son|daughter|kid|kids|child|children|cousin|aunt|uncle|niece|nephew|grandma|grandpa|grandmother|grandfather|granny|roommate|neighbour|neighbor|coworker|colleague|teammate|classmate|hubby|wifey|family',
  ADD COLUMN IF NOT EXISTS pet_words text NOT NULL DEFAULT
    'dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo';

-- get_engine_config() — surface the new word lists to the client helper.
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
    'pet_words',                pet_words
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;
