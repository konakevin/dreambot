/**
 * StarBot megastructure path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/megastructure.js
 * for 30 days as a rollback reference.
 *
 * Architecture: MEGASTRUCTURE archetype — colossal post-planetary
 * engineered construct as hero (orbital rings / Dyson swarms / planetary
 * mantles / megaships). Anchor entity at TINY/SMALL scale (silhouette
 * scale prover). 3 scale_provers (vs OUTDOOR_CITY's 2) — post-planetary
 * scale needs more anchoring. Path-bespoke setting (MEGASTRUCTURE_SETTING
 * slim pool).
 *
 * See:
 *   - scripts/lib/archetypes.js          (MEGASTRUCTURE slot definitions)
 *   - scripts/lib/archetype-templates.js (MEGASTRUCTURE brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'MEGASTRUCTURE',
  pools: {
    setting: 'MEGASTRUCTURE_SETTING', // primary megastructure pool
    // Bot anchor_entity slot overridden with megastructure-scale witnesses
    // (lone shuttle / construction-mech / fighter-wing dwarfed by structure).
    anchor_entity: 'MEGASTRUCTURE_ANCHOR_ENTITY',
    // Path-bespoke deep-distance feature (gas-giant behind / second megastructure).
    deep_distance: 'MEGASTRUCTURE_DEEP_DISTANCE',
    // Wired 2026-05-13 — conditional drama layer (40% gate) was declared by
    // archetype but never fired because no path drama pool existed.
    drama: 'MEGASTRUCTURE_DRAMA',
  },
};
