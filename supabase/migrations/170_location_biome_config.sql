-- 170 — Per-location bespoke biome config.
--
-- The shared BIOME_AXES library in _shared/biomeAxes.ts works fine for
-- broad categorical biomes (tropical_coastal for Hawaii, arctic_polar
-- for Iceland) but cannot deliver location-specific atmospheric language
-- — "Diamond Head sunrise" / "Tunnel View on El Capitan" / "neon glow
-- on Shibuya rain-slick streets" are unique to those places.
--
-- This column stores a per-location BiomeConfig JSON object that the
-- nightly engine prefers over the shared biome lookup. Each location's
-- config is authored by Sonnet via scripts/gen-location-biome.js,
-- guided by the location's flavor (soul + iconic anchors) so the
-- TIME/WEATHER/CAMERA/PHENOMENA/SUBJECT_RULE/BANS are bespoke and
-- recognizable to people who have been to that place.
--
-- NULL = the engine falls back to the shared biome lookup via
-- location_cards.biome.

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS biome_config JSONB;

COMMENT ON COLUMN public.location_cards.biome_config IS
  'Per-location bespoke BiomeConfig — TIME/WEATHER/CAMERA/PHENOMENA arrays plus SUBJECT_RULE and BANS, all tuned to this specific location. NULL = fall back to shared biome lookup via location_cards.biome.';

NOTIFY pgrst, 'reload schema';
