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
  archetype: 'ALIENS_ARCHITECTURE', // BESPOKE CHARACTER-FIRST (2026-05-13 ROUND 3)
  pools: {
    setting: 'ALIENS_ARCHITECTURE', // architecture as STAGE
    character: 'ALIENS_CHARACTER_ARCHETYPE', // colonial marine / survivor / android / etc.
    outfit: 'ALIENS_OUTFIT',
    action: 'ALIENS_ACTION', // mandatory mid-action cinematic moment
    atmosphere: 'ALIENS_ATMOSPHERE_DETAIL',
  },
};
