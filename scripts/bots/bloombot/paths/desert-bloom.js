/**
 * BloomBot desert-bloom path — declarative axis-system form (2026-05-19).
 *
 * SOUTHWEST DESERT LANDSCAPES juxtaposed with an EXPLOSION OF
 * WILDFLOWERS. Saguaro cacti corridors, joshua-tree groves, agave
 * fields, prickly-pear hillsides, red-rock canyons, mesa silhouettes,
 * sand dunes — paired with a vivid carpet of wildflowers exploding
 * around, between, and through the desert elements.
 *
 * Vivid saturated SOUTHWEST register — Sonoran-sunset palette, red
 * rocks, deep blue desert sky, blazing flower colors (NOT soft pastel).
 *
 * Inspired by Kevin-hearted bloombot post 2026-05-19 — saguaro corridor
 * with vivid red/coral/magenta wildflower carpet exploding along path.
 *
 * Axes (3 path-bespoke + universal lighting + conditional magic):
 *   - desert_anchor (25): the desert landform (saguaro / joshua-tree /
 *     mesa / red-rock / agave / yucca / barrel-cacti / sand-dune)
 *   - bloom_explosion (25): the vivid wildflower carpet exploding
 *     around the desert elements
 *   - atmospheric_magic (25, 40%-gated): golden-hour rays / dust /
 *     heat-shimmer / sun-flare / pollen-drift
 */

module.exports = {
  archetype: 'BLOOMBOT_DESERT_BLOOM',
  pools: {
    // Path override for universal `lighting` — filters out wet/snow/ice/sci-fi
    // lighting entries that don't fit a southwest desert setting.
    lighting: 'BLOOMBOT_DESERT_BLOOM_LIGHTING',
    desert_anchor: 'BLOOMBOT_DESERT_BLOOM_DESERT_ANCHOR',
    bloom_explosion: 'BLOOMBOT_DESERT_BLOOM_BLOOM_EXPLOSION',
    atmospheric_magic: 'BLOOMBOT_DESERT_BLOOM_ATMOSPHERIC_MAGIC',
  },
};
