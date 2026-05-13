/**
 * StarBot real-space path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/real-space.js
 * for 30 days as a rollback reference.
 *
 * Architecture: PHOTOREAL_ASTRO archetype — NASA-style multi-wavelength
 * composite astrophotography. FAT-seed exception: real_space_subjects
 * pool entries are complete 100-160 word scene paragraphs with
 * instrument + framing + scale-prover baked in. Narrative-only universal
 * axes (story_beat / composition_frame / emotional_dna / lighting) shape
 * angle/mood without adding visual elements that would double-stuff the
 * fat seed.
 *
 * See:
 *   - scripts/lib/archetypes.js          (PHOTOREAL_ASTRO slot definitions)
 *   - scripts/lib/archetype-templates.js (PHOTOREAL_ASTRO brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'PHOTOREAL_ASTRO',
  pools: {
    subject: 'REAL_SPACE_SUBJECTS', // primary subject (fat seed — path-bespoke)
    event: 'COSMIC_EVENT', // 35%-gated conditional drama
  },
};
