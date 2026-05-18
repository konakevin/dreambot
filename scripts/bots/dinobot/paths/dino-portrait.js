/**
 * DinoBot dino-portrait — declarative composer form (2026-05-17 migration).
 *
 * SINGLE DINOSAUR hero telephoto wildlife portrait — the camera catches one
 * specific dinosaur in a candid mid-existing-moment. Museum-grade paleoart
 * detail. Hero fills 50-70% of frame. Bokeh-soft Mesozoic biome behind.
 *
 * Reuses 3 existing production-scale pools:
 *   - DINO_SPECIES (200 dinosaur species)
 *   - DINO_VISUAL_CUES (200 atmospheric character cues)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_DINO_PORTRAIT_SURPRISE_ELEMENT (portrait accents — breath-fog,
 *     drifting-feather, dust-mote, scar-detail, pollen-particulate, etc.)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Template enforces single-hero composition, candid pose (NEVER roaring at
 * camera), telephoto wildlife framing modes, and the movie-poster quality
 * mandate.
 *
 * Pre-migration function-form at paths/legacy/dino-portrait.js.
 */

module.exports = {
  archetype: 'DINOBOT_DINO_PORTRAIT',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    species: 'DINO_SPECIES',
    visual_cue: 'DINO_VISUAL_CUES',
    surprise_element: 'DINOBOT_DINO_PORTRAIT_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
