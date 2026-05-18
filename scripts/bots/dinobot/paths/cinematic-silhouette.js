/**
 * DinoBot cinematic-silhouette — declarative composer form (2026-05-17 migration).
 *
 * DINOSAUR SILHOUETTES against breathtaking prehistoric skies — sunrise / sunset /
 * moonrise / lightning-storm / aurora / meteor-shower. The SHAPE of the animal IS
 * the subject. Fine-art wildlife-photography poster-worthy cinematography.
 *
 * Reuses 2 existing production-scale pools:
 *   - SILHOUETTE_SCENES (200 fat-seed silhouette scenes)
 *   - DINOBOT_PALEO_LANDSCAPE_BIOME (200 alien-Mesozoic biome — silhouetted horizon)
 *   - DINOBOT_PALEO_LANDSCAPE_PHENOMENON (100 atmospheric events, 80%-gated)
 *
 * Adds 1 new path-bespoke pool:
 *   - DINOBOT_CINEMATIC_SILHOUETTE_SURPRISE_ELEMENT (pterosaur silhouettes,
 *     sun/moon disk positioning, meteor streaks, etc.)
 *
 * Universal: LIGHTING + PREHISTORIC_ATMOSPHERES.
 *
 * Pre-migration function-form at paths/legacy/cinematic-silhouette.js.
 */

module.exports = {
  archetype: 'DINOBOT_CINEMATIC_SILHOUETTE',
  pools: {
    biome: 'DINOBOT_PALEO_LANDSCAPE_BIOME',
    silhouette_scene: 'SILHOUETTE_SCENES',
    surprise_element: 'DINOBOT_CINEMATIC_SILHOUETTE_SURPRISE_ELEMENT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
