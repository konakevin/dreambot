/**
 * DinoBot dino-cozy — declarative composer form (2026-05-17 migration).
 *
 * TENDER DINOSAUR VIGNETTES — nesting / grooming / sleeping / nursing /
 * playing / nuzzling-hatchlings / parent-and-juvenile-intimacy. The warm
 * peaceful side of prehistoric life. Wildlife-documentary cozy-moment
 * cinematography.
 *
 * Reuses 3 existing production-scale pools:
 *   - DINO_SPECIES (200 dinosaur species)
 *   - COZY_DINO_ACTIONS (200 fat-seed cozy actions)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_DINO_COZY_SURPRISE_ELEMENT (cozy-specific small accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * No phenomenon — cozy intimate scenes don't want dramatic atmospheric
 * events overpowering the warmth.
 *
 * Pre-migration function-form at paths/legacy/dino-cozy.js.
 */

module.exports = {
  archetype: 'DINOBOT_DINO_COZY',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    species: 'DINO_SPECIES',
    cozy_action: 'COZY_DINO_ACTIONS',
    surprise_element: 'DINOBOT_DINO_COZY_SURPRISE_ELEMENT',
  },
};
