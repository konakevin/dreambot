/**
 * DinoBot paleo-landscape — declarative composer form (2026-05-17 migration).
 *
 * PURE PREHISTORIC LANDSCAPE — Mesozoic / Jurassic / Cretaceous IMAX-scale
 * ancient world vistas. NO dinosaurs as primary subject (only tiny distant
 * silhouettes via surprise_element). The PRIMORDIAL WORLD itself is the hero —
 * mega-flora, alien Earth, lush, alive.
 *
 * Avatar Pandora × Skull Island × Land-of-the-Lost × Prehistoric-Planet
 * × Walking-with-Dinosaurs cinematics. Photoreal cinematic 35mm film still.
 *
 * Reuses PREHISTORIC_SETTINGS (200 entries) as the biome.
 *
 * Path-bespoke pools:
 *   - DINOBOT_PALEO_LANDSCAPE_MEGAFLORA (mega-cycads / tree-ferns / Araucaria)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (80%-gated dramatic atmospheric event)
 *   - DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT (tiny distant dino silhouette / pterosaur / herd)
 *   - DINOBOT_PALEO_LANDSCAPE_SKY (saturated Mesozoic sky)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/paleo-landscape.js.
 */

module.exports = {
  archetype: 'DINOBOT_PALEO_LANDSCAPE',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    megaflora: 'DINOBOT_PALEO_LANDSCAPE_MEGAFLORA',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
    surprise_element: 'DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'DINOBOT_PALEO_LANDSCAPE_SKY',
  },
};
