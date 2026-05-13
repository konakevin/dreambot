/**
 * StarBot dune-landscape path — declarative form.
 *
 * Migrated 2026-05-13. Pre-refactor file preserved at
 * paths/legacy/dune-landscape.js.
 *
 * Architecture: ALIEN_LANDSCAPE archetype with Dune-bespoke pools.
 * Frank Herbert / Denis Villeneuve aesthetic. The biome IS the hero;
 * the anchor entity is a small witness. NO franchise proper nouns in
 * output language.
 */

module.exports = {
  archetype: 'ALIEN_LANDSCAPE',
  pools: {
    biome: 'DUNE_LANDSCAPES', // existing primary path pool
    anchor_entity: 'DUNE_ANCHOR_ENTITY', // path-bespoke
    moment: 'DUNE_MOMENT', // path-bespoke
    deep_distance: 'DUNE_DEEP_DISTANCE', // path-bespoke
  },
};
