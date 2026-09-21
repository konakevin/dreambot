-- 543_create_scene_axes.sql — give Create dreams a time of day and weather, 2026-09-21.
-- Kevin: "fix the time/weather axes for create".
--
-- WHAT WAS WRONG
-- generate-dream passed `timeAxis: ''`, `weatherAxis: ''` and `phenomenaAxis: ''` — literally empty
-- strings — into the character-slot brief, while nightly-dreams rolls real values from the rolled
-- location's BIOME pools (nightly-dreams/index.ts ~2024). So the brief printed "- TIME:" with
-- nothing after it, and every Create dream of a given prompt was lit identically.
--
-- After three passes at wardrobe variety (mig 542) this was the largest remaining reason two dreams
-- of one prompt look alike. Clothing is a detail; light is the whole frame.
--
-- WHY CREATE NEEDS ITS OWN POOLS
-- Nightly can offer arctic weather because it resolved an arctic biome first. Create has no biome —
-- the place is whatever the user typed — so a blind draw from a biome pool is how you get fresh
-- snowfall on a tropical beach. The Create pools in _shared/createSceneAxes.ts are therefore
-- CLIMATE-AGNOSTIC by construction: ten times of day that exist everywhere (indoors included) and
-- seven conditions that read correctly in snow, desert, city or interior. 70 combinations.
--
-- The axes are BRIEF guidance, not prompt text — the slot brief hands them to Sonnet under
-- "ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT contradict)" — so Sonnet reconciles
-- them with the place, which is what makes "just after rain" safe on a street and quietly ignorable
-- inside a jazz club.
--
-- PHENOMENA STAYS EMPTY, on purpose. It is the most place-specific axis (aurora, fog banks,
-- fireflies) and Create's vibe fragment already owns exactly that register — `arcane` supplies
-- "drifting motes of magical light, lanterns burning in impossible colors, a soft luminous enchanted
-- mist", and the brief tells Sonnet the vibe OWNS the light and weather of the scene. Rolling a
-- phenomenon on top would put two authors on one sentence.
--
-- OFF (default): the three empty strings, byte-identical to today. Nightly is untouched — it keeps
-- rolling from its biome pools and never reads this column.
--
-- ROLLBACK:
--   UPDATE public.engine_config SET create_scene_axes = false WHERE id = 1;
--   ALTER TABLE public.engine_config DROP COLUMN IF EXISTS create_scene_axes;
BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_scene_axes boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.create_scene_axes IS
  'Create only: roll a time of day + weather from climate-agnostic pools instead of sending empty '
  'axis strings. Nightly rolls these per-biome; Create has no biome. Phenomena stays empty because '
  'the vibe fragment already owns it. false = the original empty strings.';

COMMIT;
