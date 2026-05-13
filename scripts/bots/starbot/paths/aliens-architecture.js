/**
 * StarBot aliens-architecture path — declarative form.
 *
 * Migrated 2026-05-13. Pre-refactor file preserved at
 * paths/legacy/aliens-architecture.js.
 *
 * Architecture: ARCHITECTURE_INTERIOR archetype — pure architecture
 * (no figures). Path-bespoke pools encode the Aliens franchise visual
 * DNA (H.R. Giger / Ridley Scott / Cameron / Ron Cobb tradition).
 *
 * See:
 *   - scripts/lib/archetypes.js          (ARCHITECTURE_INTERIOR slot definitions)
 *   - scripts/lib/archetype-templates.js (ARCHITECTURE_INTERIOR brief template)
 */

module.exports = {
  archetype: 'ALIENS_ARCHITECTURE', // BESPOKE archetype (2026-05-13 retry)
  pools: {
    setting: 'ALIENS_ARCHITECTURE', // primary biome pool (50 entries — Stage 2 expansion deferred)
    atmosphere: 'ALIENS_ATMOSPHERE_DETAIL',
    deep_distance: 'ALIENS_DEEP_DISTANCE',
    incident: 'ALIENS_INCIDENT', // 40% gated
  },
};
