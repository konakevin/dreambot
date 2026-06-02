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
    // NEW path-bespoke axes (2026-05-31 enrichment from 2 → 8 bespoke pools):
    painted_tradition: 'COSMIC_VISTA_PAINTED_TRADITION', // ALWAYS-ON identity — painter aesthetic
    vista_composition: 'COSMIC_VISTA_COMPOSITION', // 50%-gated — painted framing
    narrative_witness: 'COSMIC_VISTA_NARRATIVE_WITNESS', // 50%-gated — tiny silhouette scale-prover
    atmospheric_layer: 'COSMIC_VISTA_ATMOSPHERIC_LAYER', // 50%-gated — terrestrial-foreground atmosphere
    color_register: 'COSMIC_VISTA_COLOR_REGISTER', // 50%-gated — painted palette signature
    signature_phenomenon: 'COSMIC_VISTA_SIGNATURE_PHENOMENON', // 50%-gated — bigger painted cosmic drama
    // Split from shared COSMIC_EVENT — path-bespoke per cross-bot rule
    event: 'COSMIC_VISTA_EVENT', // 40%-gated conditional drama
  },
};
