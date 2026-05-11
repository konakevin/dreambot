-- 169 — Rename "Caribbean Island" → "Caribbean Islands" as a multi-island meta.
--
-- Same meta pattern as Ancient Wonders / High Fantasy / Gothic Realm /
-- Sci-Fi Worlds: one picker entry stands in for many destinations
-- (St. John, St. Thomas, Aruba, Barbados, Jamaica, Bahamas, BVIs, Turks
-- & Caicos, etc.). Stage 1 (gen-location-hints) will split these into
-- sub_regions; Stage 2 (gen-iconic-spots-50) will generate ~100 pillars
-- distributed across the islands.
--
-- Also sets biome=tropical_coastal so the axes engine picks the right
-- TIME/WEATHER/PHENOMENA pools for tropical beach/reef scenes.

UPDATE public.location_cards
  SET name = 'caribbean islands',
      display_name = 'Caribbean Islands',
      biome = 'tropical_coastal'
  WHERE name = 'caribbean island';

NOTIFY pgrst, 'reload schema';
