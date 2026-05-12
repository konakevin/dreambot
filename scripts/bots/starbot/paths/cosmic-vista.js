/**
 * StarBot cosmic-vista path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/cosmic-vista.js
 * for 30 days as a rollback reference.
 *
 * Architecture: PURE_COSMOS archetype — astronomical phenomenon as
 * subject, no figure. The composer resolves universal/bot axes from
 * StarBot's defaultPools; this file declares the path-bespoke pools.
 *
 * See:
 *   - scripts/lib/archetypes.js          (PURE_COSMOS slot definitions)
 *   - scripts/lib/archetype-templates.js (PURE_COSMOS brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'PURE_COSMOS',
  pools: {
    phenomenon: 'COSMIC_PHENOMENA', // primary subject (path-bespoke)
    event: 'COSMIC_EVENT', // 40%-gated conditional drama
  },
};
