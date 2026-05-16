/**
 * BloomBot tropical-paradise — declarative axis-system form (2026-05-16 migration).
 *
 * DENSE TROPICAL JUNGLE FLORAL SCENE. Region locked to "tropical" in
 * BloomBot.rollSharedDNA (path-conditional). Wide cinematic depth-recession
 * with humid atmospheric perspective. Massive showy tropical flowers
 * (torch ginger / heliconia / plumeria / jade vine / orchid / bird-of-
 * paradise) at jungle scale.
 *
 * Legacy compositional version preserved at paths/legacy/tropical-paradise.js.
 *
 * Axes (2 path-bespoke + 60%-gated creature):
 *   - tropical_setting (200): the specific tropical biome
 *   - vegetation_anchor (150): the jungle scaffolding (palms / banyan /
 *     banana / philodendron / ferns)
 *   - surprise_creature (50, 60%-gated): tropical wildlife at peripheral scale
 */

module.exports = {
  archetype: 'BLOOMBOT_TROPICAL_PARADISE',
  pools: {
    tropical_setting: 'BLOOMBOT_TROPICAL_PARADISE_TROPICAL_SETTING',
    vegetation_anchor: 'BLOOMBOT_TROPICAL_PARADISE_VEGETATION_ANCHOR',
    surprise_creature: 'BLOOMBOT_TROPICAL_PARADISE_SURPRISE_CREATURE',
  },
};
