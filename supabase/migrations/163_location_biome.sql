-- 163 — Biome tag on location_cards
--
-- Each location gets a biome tag that determines (a) which axes pool
-- nightly pulls from (time / weather / camera / phenomenon), (b) which
-- content rules apply (some biomes allow fantasy/sci-fi).
--
-- Phase 1 of the biome system: schema only. tropical_coastal is the
-- proof-of-concept biome (Hawaii). Other biomes are added by follow-up
-- migrations as we expand. Locations without a biome fall back to
-- tropical_coastal in the Edge Function (matches current hardcoded
-- behavior).

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS biome text;

-- Hawaii — the proof-of-concept location
UPDATE public.location_cards SET biome = 'tropical_coastal' WHERE name = 'hawaii';

CREATE INDEX IF NOT EXISTS idx_location_cards_biome ON public.location_cards (biome);

NOTIFY pgrst, 'reload schema';
