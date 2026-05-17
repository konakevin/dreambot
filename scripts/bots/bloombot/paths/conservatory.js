/**
 * BloomBot conservatory — declarative axis-system form (2026-05-16 migration).
 *
 * VICTORIAN GLASS-AND-IRON CONSERVATORY interior fully OVERGROWN.
 * Half-architectural / half-jungle. Wide-angle interior with volumetric
 * god-rays through the glass.
 *
 * Legacy compositional version preserved at paths/legacy/conservatory.js.
 *
 * Axes (2 path-bespoke + 60%-gated phenomenon):
 *   - conservatory_type (150): the Victorian glass-and-iron architectural shell
 *   - structural_anchor (100): the central focal piece
 *   - atmospheric_phenomenon (50, 60%-gated): magic-moment element
 */

module.exports = {
  archetype: 'BLOOMBOT_CONSERVATORY',
  pools: {
    conservatory_type: 'BLOOMBOT_CONSERVATORY_CONSERVATORY_TYPE',
    structural_anchor: 'BLOOMBOT_CONSERVATORY_STRUCTURAL_ANCHOR',
    atmospheric_phenomenon: 'BLOOMBOT_CONSERVATORY_ATMOSPHERIC_PHENOMENON',
  },
};
