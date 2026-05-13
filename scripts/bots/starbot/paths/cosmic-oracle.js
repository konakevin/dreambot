/**
 * StarBot cosmic-oracle path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/cosmic-oracle.js
 * for 30 days as a rollback reference.
 *
 * Architecture: CHARACTER archetype — solo figure of a sci-fi lineage
 * caught mid-action within a richly-detailed cosmic environment.
 * MEDIUM-LARGE anchor scale (figure visible without dominating). Three
 * path-bespoke slim pools: characters / locations / actions. Conditional
 * 40%-gated ritual_moment drama for mystic / channeling beats.
 *
 * See:
 *   - scripts/lib/archetypes.js          (CHARACTER slot definitions)
 *   - scripts/lib/archetype-templates.js (CHARACTER brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'CHARACTER',
  pools: {
    character: 'COSMIC_ORACLE_CHARACTERS', // primary anchor entity (slim)
    location: 'COSMIC_ORACLE_LOCATIONS', // cosmic environment (slim)
    action: 'COSMIC_ORACLE_ACTIONS', // body-shaping action (slim)
    drama: 'RITUAL_MOMENT', // 40%-gated conditional drama
  },
};
