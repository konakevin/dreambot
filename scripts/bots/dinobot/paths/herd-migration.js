/**
 * DinoBot herd-migration — declarative composer form (2026-05-17 migration).
 *
 * COLOSSAL DINOSAUR HERD scenes — 1-3 hero foreground dinosaurs + 50-200 strong
 * herd extending to vanishing-point silhouettes. Recognizable dinosaur cues
 * throughout (S-curve necks, crests, frills, plate-rows, spike-tails) so the
 * silhouettes never read as wildebeest. BBC-Planet-Earth + Prehistoric-Planet
 * documentary cinematography.
 *
 * Reuses 2 existing production-scale pools:
 *   - HERD_SCENES (200 fat-seed herd scenes)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_HERD_MIGRATION_SURPRISE_ELEMENT (herd-specific small accents)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/herd-migration.js.
 */

module.exports = {
  archetype: 'DINOBOT_HERD_MIGRATION',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    herd_scene: 'HERD_SCENES',
    surprise_element: 'DINOBOT_HERD_MIGRATION_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
