/**
 * BloomBot cozy — declarative axis-system form (2026-05-16 migration).
 *
 * COZY INTERIOR OVERGROWN BY FLOWERS. Warm humble domestic space —
 * sunroom / breakfast nook / writing desk / arched window / attic dormer
 * — NEVER palace / ballroom / grand interior. The architecture is the
 * scaffold the bloom-mass cascades through and over.
 *
 * Legacy compositional version preserved at paths/legacy/cozy.js.
 *
 * Axes (2 path-bespoke + 60%-gated moment):
 *   - interior_setting (200): the cozy room canvas
 *   - furniture_anchor (150): the structural tactile piece
 *   - atmospheric_moment (50, 60%-gated): the warm-domestic magic moment
 */

module.exports = {
  archetype: 'BLOOMBOT_COZY',
  pools: {
    interior_setting: 'BLOOMBOT_COZY_INTERIOR_SETTING',
    furniture_anchor: 'BLOOMBOT_COZY_FURNITURE_ANCHOR',
    atmospheric_moment: 'BLOOMBOT_COZY_ATMOSPHERIC_MOMENT',
  },
};
