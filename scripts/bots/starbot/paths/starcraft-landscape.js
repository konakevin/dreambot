/**
 * StarBot starcraft-landscape path — declarative form.
 *
 * Migrated 2026-05-13. Blizzard / Sam Didier / Glenn Rane / Trent Kaniuga
 * concept-art tradition. Three faction-coded biomes (industrial-rust /
 * gold-crystalline / organic-biomech). NO franchise nouns.
 */

module.exports = {
  archetype: 'ALIEN_LANDSCAPE',
  pools: {
    biome: 'STARCRAFT_LANDSCAPES',
    anchor_entity: 'STARCRAFT_ANCHOR_ENTITY',
    moment: 'STARCRAFT_MOMENT',
    deep_distance: 'STARCRAFT_DEEP_DISTANCE',
  },
};
