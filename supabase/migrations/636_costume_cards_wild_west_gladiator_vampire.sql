-- 636: costume cards on (Kevin 2026-09-30: "ok flip them"). The 8 Wild West cards, Gladiator Arena and Vampire Castle
-- dress the cast from their own biome_config.WARDROBE (_shared/costumeWardrobe.ts, nightly-dreams v284) instead of
-- the generic outfit roll for the setting. The A/B (https://claude.ai/artifact/CZjpYyJZuNbnFurWsbk6F7) won on all
-- five cards rendered: a saloon girl in a corset instead of a blazer and handbag in the snow, gladiator kit instead of
-- a utility jacket. Real-culture cards are never flagged (the race-swap guard, RACE_FIDELITY_PLAN.md).
-- Rollback: the same names with costume set to false. Re-runnable.

UPDATE public.location_cards
SET biome_config = jsonb_set(biome_config, '{costume}', 'true'::jsonb, true)
WHERE name IN (
  'frontier town', 'railroad town', 'outlaw hideout', 'gold rush camp', 'desert canyon standoff',
  'monument valley trail', 'cattle ranch', 'saloon', 'gladiator arena', 'vampire castle'
)
  AND jsonb_typeof(biome_config -> 'WARDROBE') = 'array'
  AND jsonb_array_length(biome_config -> 'WARDROBE') > 0;

SELECT name FROM public.location_cards WHERE (biome_config ->> 'costume')::boolean IS TRUE ORDER BY name;
