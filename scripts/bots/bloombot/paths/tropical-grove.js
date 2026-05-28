/**
 * BloomBot tropical-grove path (2026-05-27 NEW).
 *
 * The Hawaiian/tropical FUN/CRAZY cousin of flower-grove — a "Hawaiian Dr Seuss"
 * jungle wonderland of GIANT oversized tropical flowers (hibiscus / bird-of-
 * paradise / heliconia / plumeria / orchid scaled enormous as flower-trees +
 * tree-sized mega-blooms), framed by lush green monstera/palm/fern foliage, set
 * in volcanic / jungle / lagoon / waterfall / beach paradise (NOT temperate
 * fields). Gravity-defying Hawaiian whimsy, just as wild as flower-grove.
 *
 * Uses the flower engine at biome=tropical (real tropical species + hot
 * palettes; rollSharedDNA maps this path → 'tropical'). FORM/SETTING from the
 * pools; COLOR + species from the engine theme (color-spread fix applies).
 *
 * Axes (4 path-bespoke + whimsy conditional 85%-gated + universal lighting):
 *   - canopy     (giant tropical flower-tree / mega-bloom hero forms)
 *   - setting    (volcanic / jungle / lagoon / waterfall / beach locale)
 *   - foliage    (lush green monstera/palm/fern framing greenery)
 *   - atmosphere (tropical water/air drama — waterfalls / rainbows / light-shafts)
 *   - whimsy     (85%-gated — the gravity-defying Hawaiian Dr-Seuss crazy)
 */

module.exports = {
  archetype: 'BLOOMBOT_TROPICAL_GROVE',
  pools: {
    canopy: 'BLOOMBOT_TROPICAL_GROVE_CANOPY',
    setting: 'BLOOMBOT_TROPICAL_GROVE_SETTING',
    foliage: 'BLOOMBOT_TROPICAL_GROVE_FOLIAGE',
    atmosphere: 'BLOOMBOT_TROPICAL_GROVE_ATMOSPHERE',
    whimsy: 'BLOOMBOT_TROPICAL_GROVE_WHIMSY',
  },
};
