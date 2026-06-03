-- Migration 216: drop the entire objects / "things" personal-anchor feature
--
-- Removes:
--   1. The `dream_seeds.things` text[] column (vestigial after engine strip)
--   2. The `object_cards` table + its derived schema from migrations 112/114
--      (cinematic Sonnet-generated cards for each object name)
--   3. The `dream_seeds,things` key from existing `user_recipes.recipe` JSONB
--
-- Companion code strip — see commits 2026-06-02 + project_objects_removed_
-- 2026-06-02 memory:
--   • Onboarding step 6 (Objects) removed from the flow + ObjectPickerStep
--     + the /settings/objects drill-in deleted
--   • VibeProfile.dream_seeds.things field removed; store handlers dropped
--   • sceneEngine.ts: ObjectCardData + object-injection block stripped
--   • dreamAlgorithm.ts: includeObject roll removed (location-only now)
--   • essenceCards.ts: ObjectCard interface + getObjectCard +
--     generateObjectCard removed (location_cards untouched)
--   • nightly-dreams + generate-first-dream: userThing / thingsPool /
--     object-location compat filter all stripped
--
-- Rollback: revert this migration to restore the column + table shape;
-- code revert restores reads/writes. Existing data lost — JSONB cleanup
-- below is non-recoverable from this migration alone.

-- 1. Strip the dream_seeds.things key from every user's recipe JSONB so
--    no stale field lingers in the source of truth. Idempotent: the
--    `#-` path-delete operator no-ops when the key is absent.
update public.user_recipes
   set recipe = recipe #- '{dream_seeds,things}'
 where recipe ? 'dream_seeds'
   and (recipe -> 'dream_seeds') ? 'things';

-- 2. Drop the dream_seeds.things column. No code reads it post-strip.
alter table public.dream_seeds drop column if exists things;

-- 3. Drop the object_cards table. cascade catches object_card_context_
--    bridges + any other derived constraints from migrations 112 + 114.
drop table if exists public.object_cards cascade;
