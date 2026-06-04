-- 221_location_iconic_spots_pure_scene_eligible.sql
--
-- Phase 2 of the pure_scene quality work — adds a per-spot
-- `pure_scene_eligible` boolean column so the engine can roll from a
-- precise "postcard-worthy" pool instead of the coarse quality_tier
-- (S/A/B) heuristic from Phase 1.
--
-- Backfill strategy after this migration:
--   S-tier spots → pure_scene_eligible = true   (known postcard-grade)
--   B-tier spots → pure_scene_eligible = false  (known mundane / random building)
--   A-tier spots → pure_scene_eligible = null   (pending Sonnet pass — strict
--                                                postcard rubric: would a
--                                                tourist photograph this for
--                                                Instagram? Or is it a niche
--                                                landmark only specialists
--                                                care about?)
--
-- Engine (nightly-dreams/index.ts) switches the pure_scene anchor filter
-- from `quality_tier IN ('S','A')` to `pure_scene_eligible = true` once
-- the A-tier classification pass completes.

ALTER TABLE public.location_iconic_spots
  ADD COLUMN IF NOT EXISTS pure_scene_eligible boolean;

-- Useful for the engine's filtered roll (per-location random pick over a
-- single-column equality + active filter). Partial so the index only
-- carries the rows we actually query against.
CREATE INDEX IF NOT EXISTS location_iconic_spots_pure_scene_idx
  ON public.location_iconic_spots (location_key)
  WHERE pure_scene_eligible = true AND is_active = true;
