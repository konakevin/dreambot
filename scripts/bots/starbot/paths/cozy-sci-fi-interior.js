/**
 * StarBot cozy-sci-fi-interior path — declarative form.
 *
 * Migrated 2026-05-13 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/cozy-sci-fi-interior.js.
 *
 * Architecture: COZY_INTERIOR archetype — intentionally minimalist
 * (canonical-LITE). The brief is narrative-only universal axes (story_beat
 * / composition_frame / emotional_dna / lighting) because cozy spaces
 * over-stuff fast — scale provers, surprise elements, weather particles,
 * and sky layers ALL fight against intimate cozy renders. The cozy
 * interior pool already bakes lived-in details into each fat seed.
 *
 * 3 path-bespoke pools (meets new 2026-05-13 playbook minimum):
 *   - interior (COZY_SCI_FI_INTERIORS, 199-entry fat seed) — primary scene
 *   - warmth_source (COZY_WARMTH_SOURCE, 30 entries) — the dominant heat-
 *     and-light center of each cozy scene
 *   - cozy_moment (COZY_MOMENT, conditional 40% gate) — small intimate
 *     human-scale freeze-frame action / detail
 *
 * Framing modes: 70% wide-room (DEFAULT — room dominates, window in
 * periphery), 30% zoom-in (window centerpiece with cozy elements framing).
 *
 * See:
 *   - scripts/lib/archetypes.js          (COZY_INTERIOR slot definitions)
 *   - scripts/lib/archetype-templates.js (COZY_INTERIOR brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'COZY_INTERIOR',
  pools: {
    interior: 'COZY_SCI_FI_INTERIORS',
    warmth_source: 'COZY_WARMTH_SOURCE',
    cozy_moment: 'COZY_MOMENT', // 40% gated conditional layer
  },
};
