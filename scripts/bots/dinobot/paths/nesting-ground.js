/**
 * DinoBot nesting-ground — declarative composer form (2026-05-17 migration).
 *
 * MESOZOIC FAMILY-LIFE scenes — hatchlings tumbling, parents teaching juveniles,
 * siblings play-fighting, families migrating, parents defending young, communal
 * nurseries. The full spectrum of dinosaur family behavior (not just egg-sitting).
 * National-Geographic-cinematic tender prehistoric family moments.
 *
 * Reuses 3 existing production-scale pools:
 *   - NESTING_SCENES (200 fat-seed family-life scenes)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_NESTING_GROUND_SURPRISE_ELEMENT (family-specific small accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/nesting-ground.js.
 */

module.exports = {
  archetype: 'DINOBOT_NESTING_GROUND',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    family_scene: 'NESTING_SCENES',
    surprise_element: 'DINOBOT_NESTING_GROUND_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
