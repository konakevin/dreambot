-- 616: the three new Dreamscapes worlds (mig 615) are imagined worlds: biome_config.imagined = true, set after
-- gen-location-biome.js wrote their configs (the generator does not set it). It bans photo mediums there (painterly
-- only), the same as Glowing Elements and Impossible Whimsy. Re-runnable.

UPDATE public.location_cards
SET biome_config = biome_config || '{"imagined": true}'::jsonb
WHERE name IN ('celestial realm', 'overgrown wonders', 'impossible architecture')
  AND biome_config IS NOT NULL;

DO $$
BEGIN
  IF (SELECT count(*) FROM public.location_cards
      WHERE name IN ('celestial realm', 'overgrown wonders', 'impossible architecture')
        AND (biome_config ->> 'imagined')::boolean IS TRUE) <> 3 THEN
    RAISE EXCEPTION '616: expected 3 imagined configs (run gen-location-biome.js first)';
  END IF;
END $$;
