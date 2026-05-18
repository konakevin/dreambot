/**
 * DinoBot dino-action — declarative composer form (2026-05-17 migration).
 *
 * DYNAMIC PEAK-ACTION single dinosaur — frozen-frame predator hunt /
 * charge / mid-strike / sudden-spring / fleeing-prey-mid-stride.
 * BBC-cameraman-caught-the-moment energy. No gore.
 *
 * Reuses 3 existing production-scale pools:
 *   - DINO_SPECIES (200 dinosaur species)
 *   - DINO_ACTIONS (200 fat-seed peak-action verbs)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_DINO_ACTION_SURPRISE_ELEMENT (action accents — dust-spray,
 *     fleeing-prey-silhouette, mud-prints, motion-particulate)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Template enforces single-hero peak-action, no-gore mandate, grounded
 * mandate (rewrite "leap" → "claws-just-leaving-mud"), movie-poster
 * quality, and species + biome variety mandates.
 *
 * Pre-migration function-form at paths/legacy/dino-action.js.
 */

module.exports = {
  archetype: 'DINOBOT_DINO_ACTION',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    species: 'DINO_SPECIES',
    action: 'DINO_ACTIONS',
    surprise_element: 'DINOBOT_DINO_ACTION_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
