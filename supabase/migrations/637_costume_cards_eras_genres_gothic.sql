-- 637: the rest of the costume cards (Kevin 2026-09-30: "fix all remaining cards that need it"), after the Wild West,
-- Gladiator Arena and Vampire Castle (mig 636). Cards whose theme is a period or a genre dress the cast from their own
-- biome_config.WARDROBE (_shared/costumeWardrobe.ts) instead of the generic outfit roll: the European eras, the
-- action-and-adventure genres, the gothic cards, and Starship Bridge / Moon Base (sci-fi, but their biome is not one of
-- the always-imagined ones, so their command uniforms were being suppressed). Five frumpy lists were regenerated first
-- with gen-location-wardrobe.js (Ghost Town's prairie dresses, Greece's coarse wool, Rome's undyed stola, Venice's
-- craftsman's apron, Prehistoric's henley and work boots).
-- Deliberately NOT flagged: Feudal Japan, Ancient Egypt and Silk Road, whose lists are a real culture's dress (the
-- race-swap guard, RACE_FIDELITY_PLAN.md). Rollback: these names with costume set to false. Re-runnable.

UPDATE public.location_cards
SET biome_config = jsonb_set(biome_config, '{costume}', 'true'::jsonb, true)
WHERE name IN (
  'prehistoric', 'ancient rome', 'ancient greece', 'pirate cove', 'viking longhouse', 'medieval village',
  'renaissance venice', 'victorian london', '1920s speakeasy', '1950s americana',
  'haunted mansion', 'ghost town', 'gothic cathedral', 'witch''s cottage', 'catacombs', 'foggy graveyard',
  'spy lair', 'superhero city rooftop', 'carrier flight deck', 'mountain summit expedition', 'race track garage',
  'jungle temple expedition', 'epic battlefield', 'starship bridge', 'moon base'
)
  AND jsonb_typeof(biome_config -> 'WARDROBE') = 'array'
  AND jsonb_array_length(biome_config -> 'WARDROBE') > 0;

SELECT count(*) AS costume_cards FROM public.location_cards WHERE (biome_config ->> 'costume')::boolean IS TRUE;
