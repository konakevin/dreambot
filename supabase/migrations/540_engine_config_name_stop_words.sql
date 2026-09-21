-- 540_engine_config_name_stop_words.sql — live stop-list for CAST-NAME matching, 2026-09-21.
-- Kevin: "support people saying 'show me and Steph' ... if we can't find that person, we should prompt".
--
-- WHY THIS COLUMN EXISTS
-- The self-insert detector now resolves a Create prompt to a SPECIFIC cast member by searching the
-- prompt for the names the user gave their roster (at most 5). That is a bounded search, not name
-- extraction — we already hold the candidate list — but it has one real failure mode: names that
-- double as scenery. A user with a cast member called Dawn types "a walk at dawn by the river" and
-- the engine casts a person into a landscape they never asked for.
--
-- The stop list gates BARE mentions only. An explicit couple construction ("me and Dawn") overrides
-- it, because the construction is itself the evidence that a person is meant — so someone genuinely
-- called Dawn, Luna or Rose is never locked out of their own name.
--
-- It lives here rather than in code for the same reason relationship_words / pet_words (migration
-- 256) do: a bad match is a user-visible wrong-person render, and this makes the fix a dashboard
-- UPDATE with no deploy. The code constant (DEFAULT_NAME_STOP_WORDS in
-- _shared/selfInsertDetector.ts, mirrored in lib/selfInsertDetect.ts) stays the fallback for when
-- this value is null or unreachable, and the jest parity suite fails if the two mirrors drift.
--
-- FORMAT: a regex alternation, matched whole-string and case-insensitively against one name at a
-- time. Keep it lowercase and pipe-separated; no anchors, no groups.
--
-- ROLLBACK:
--   ALTER TABLE public.engine_config DROP COLUMN IF EXISTS name_stop_words;
BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS name_stop_words text;

COMMENT ON COLUMN public.engine_config.name_stop_words IS
  'Regex alternation of words a BARE cast-name mention must never match (scenery that doubles as a '
  'name: dawn, rose, luna...). An explicit "me and X" couple construction overrides it. NULL falls '
  'back to DEFAULT_NAME_STOP_WORDS in _shared/selfInsertDetector.ts.';

UPDATE public.engine_config
   SET name_stop_words =
       'dawn|dusk|sky|star|storm|river|ocean|forest|meadow|summer|autumn|winter|spring|rose|ivy|'
       'jade|amber|pearl|ruby|opal|angel|faith|hope|grace|joy|misty|crystal|luna|aurora|nova|'
       'sierra|savannah|willow|hazel|olive|daisy|lily|violet|iris|heather|brook|wren|robin|fox|'
       'bear|wolf|king|queen|prince|art|may|june|dale|glen|cliff|reed|sunny|lucky|champ'
 WHERE id = 1
   AND name_stop_words IS NULL;

COMMIT;
