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
  archetype: 'DUNE_LANDSCAPE', // BESPOKE (2026-05-13 retry)
  pools: {
    biome: 'DUNE_LANDSCAPES',
    anchor_entity: 'DUNE_ANCHOR_ENTITY',
    moment: 'DUNE_MOMENT',
    deep_distance: 'DUNE_DEEP_DISTANCE',
  },
};
