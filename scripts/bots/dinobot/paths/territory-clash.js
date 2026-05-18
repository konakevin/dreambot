/**
 * DinoBot territory-clash — declarative composer form (2026-05-17 migration).
 *
 * TWO MESOZOIC DINOSAURS in dominance confrontation — horn-locks, frill-pushes,
 * head-butts, jaw-clamps, threat-displays, ground-shaking charges. Raw primal
 * power without gore. National-Geographic-cinematic territorial cinematography.
 *
 * Reuses 2 existing production-scale pools:
 *   - CLASH_SCENES (200 fat-seed two-dinosaur clash scenes)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_TERRITORY_CLASH_SURPRISE_ELEMENT (clash-specific small accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/territory-clash.js.
 */

module.exports = {
  archetype: 'DINOBOT_TERRITORY_CLASH',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    clash_scene: 'CLASH_SCENES',
    surprise_element: 'DINOBOT_TERRITORY_CLASH_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
