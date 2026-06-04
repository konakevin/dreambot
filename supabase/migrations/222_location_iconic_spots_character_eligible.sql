-- 222_location_iconic_spots_character_eligible.sql
--
-- Per-spot `character_eligible` boolean for the engine's cast paths
-- (character + epic_tiny). Mirror shape of `pure_scene_eligible`
-- (migration 221) but applies different curation logic:
--
--   pure_scene_eligible:
--     "Is this a postcard-worthy scene that can BE the subject of a
--      no-human render?"
--
--   character_eligible:
--     "Is this a coherent BACKDROP for a face-swapped person?"
--
-- The bar is different in both directions. Iconic-architecture
-- buildings work fine for cast (person in front of Capitol Records)
-- but not as standalone pure_scene anchors. Conversely, the Phase 4
-- pretty-landscape entries authored 2026-06-04 (moss-covered logs,
-- aurora over geothermal pools, etc.) were explicitly designed
-- "NO humans, NO figures" — they fight cast injection.
--
-- Backfill strategy (executed after this migration in the companion
-- scripts):
--   1. Phase 4 entries identified by created_at + quality_tier='S' +
--      first char lowercase → character_eligible=false
--   2. Everything else defaults true
--   3. Sonnet pass (scripts/qa-character-pool.js) flips the truly
--      weak entries (vague "X views", mundane backdrops, biome
--      confusion) to false
--
-- Partial index speeds the engine's filtered roll once populated.

ALTER TABLE public.location_iconic_spots
  ADD COLUMN IF NOT EXISTS character_eligible boolean;

CREATE INDEX IF NOT EXISTS location_iconic_spots_character_idx
  ON public.location_iconic_spots (location_key)
  WHERE character_eligible = true AND is_active = true;
