/**
 * BloomBot dreamscape — declarative axis-system form (2026-05-16 migration).
 *
 * SURREAL FLORAL DREAMSCAPE — physically impossible composition rendered
 * with HYPERREAL/PHOTOREAL precision. Real earth-bound species (NOT alien
 * flowers); the impossibility is in the LAYOUT. Magritte / Dali /
 * Beksinski / Storm Thorgerson lineage.
 *
 * Legacy compositional version preserved at paths/legacy/dreamscape.js.
 *
 * Axes (2 path-bespoke + 60%-gated halo):
 *   - impossibility_type (200): the physics break (floating / inverted /
 *     mirror-world / Magritte-window / container-world / spiral / portal)
 *   - world_element (100): the hyperreal physical object the impossibility
 *     breaks (sphere / staircase / lake / window / picture-frame / etc.)
 *   - atmospheric_halo (50, 60%-gated): surreal-lighting element
 */

module.exports = {
  archetype: 'BLOOMBOT_DREAMSCAPE',
  pools: {
    impossibility_type: 'BLOOMBOT_DREAMSCAPE_IMPOSSIBILITY_TYPE',
    world_element: 'BLOOMBOT_DREAMSCAPE_WORLD_ELEMENT',
    atmospheric_halo: 'BLOOMBOT_DREAMSCAPE_ATMOSPHERIC_HALO',
  },
};
