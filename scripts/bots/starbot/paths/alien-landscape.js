/**
 * StarBot alien-landscape path — declarative form.
 *
 * Migrated 2026-05-13 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/alien-landscape.js.
 *
 * Architecture: ALIEN_LANDSCAPE archetype — alien planet biome as hero,
 * anchor entity at TINY/SMALL scale (silhouette scale prover). Mirrors
 * MEGASTRUCTURE structure but biome-focused instead of engineered-
 * construct-focused. Path-bespoke primary pool: ALIEN_PLANET_BIOME
 * (200 entries, all healthy).
 *
 * See:
 *   - scripts/lib/archetypes.js          (ALIEN_LANDSCAPE slot definitions)
 *   - scripts/lib/archetype-templates.js (ALIEN_LANDSCAPE brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'ALIEN_LANDSCAPE',
  pools: {
    biome: 'ALIEN_PLANET_BIOME', // primary path pool (200 entries)
    // Bot anchor_entity slot is overridden with a path-bespoke pool that
    // only contains lone wilderness witnesses (no cities, no capital ships).
    anchor_entity: 'LANDSCAPE_ANCHOR_ENTITY',
    moment: 'LANDSCAPE_MOMENT',
    deep_distance: 'LANDSCAPE_DEEP_DISTANCE',
  },
};
