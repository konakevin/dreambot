/**
 * BloomBot landscape — declarative axis-system form (2026-05-16 migration).
 *
 * Pure-scenery epic floral landscape. The LANDFORM is the canvas, the
 * BLOOM-CARPET is the hero. NO HUMANS, NO FIGURES. Multi-tier depth
 * (foreground microflowers + midground statement blooms + receding
 * bloom-fields). Hyperreal CGI register, jewel-toned cinematic, named
 * regional species from sharedDNA.roster.
 *
 * Legacy compositional version preserved at paths/legacy/landscape.js.
 *
 * Axes (5 path-bespoke + sharedDNA-injected palette/lighting/roster):
 *   - landform (200): the dominant terrain (canvas for the bloom-carpet)
 *   - scale_prover (150): tiny element that proves epic scale
 *   - surprise_element (150): small unexpected secondary detail
 *   - sky (100): atmospheric upper-frame
 *   - phenomenon (50, 80%-gated): dramatic "wow moment"
 */

module.exports = {
  archetype: 'BLOOMBOT_LANDSCAPE',
  pools: {
    landform: 'BLOOMBOT_LANDSCAPE_LANDFORM',
    scale_prover: 'BLOOMBOT_LANDSCAPE_SCALE_PROVER',
    surprise_element: 'BLOOMBOT_LANDSCAPE_SURPRISE_ELEMENT',
    sky: 'BLOOMBOT_LANDSCAPE_SKY',
    phenomenon: 'BLOOMBOT_LANDSCAPE_PHENOMENON',
  },
};
