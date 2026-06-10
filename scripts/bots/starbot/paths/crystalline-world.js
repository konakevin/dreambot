/**
 * StarBot crystalline-world path — declarative form (2026-06-09, NEW).
 *
 * An alien world of titanic translucent crystal prisms, a star's light
 * fracturing through them into rainbow caustics and prismatic shafts.
 * Pure jewel-like spectacle. Scene-led — the crystal terrain + refracted
 * light are the hero. Bot default starbot_hyperreal medium.
 *
 * See:
 *   - scripts/bots/starbot/archetypes.js          (CRYSTALLINE_WORLD slots)
 *   - scripts/bots/starbot/archetype-templates.js (CRYSTALLINE_WORLD template)
 *
 * Pools are MVP-25 (2026-06-09) — seed-test-then-scale per Kevin's mandate.
 */

module.exports = {
  archetype: 'CRYSTALLINE_WORLD',
  pools: {
    composition: 'CRYSTALLINE_WORLD_COMPOSITION',
    crystal_formation: 'CRYSTALLINE_WORLD_FORMATION',
    crystal_material: 'CRYSTALLINE_WORLD_MATERIAL',
    light_refraction: 'CRYSTALLINE_WORLD_REFRACTION',
    ground_detail: 'CRYSTALLINE_WORLD_GROUND',
    sky_above: 'CRYSTALLINE_WORLD_SKY',
    // conditional layer (40% gate)
    crystal_event: 'CRYSTALLINE_WORLD_EVENT',
  },
};
