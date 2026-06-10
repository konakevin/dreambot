/**
 * DragonBot dragon-hoard path (2026-06-10, NEW). A colossal Western dragon
 * coiled atop a mountain of treasure in its lair (Smaug). Default
 * painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DRAGON_HOARD',
  pools: {
    dragon: 'DRAGON_HOARD_DRAGON',
    hoard: 'DRAGON_HOARD_HOARD',
    lair: 'DRAGON_HOARD_LAIR',
    dragon_pose: 'DRAGON_HOARD_POSE',
    intruder: 'DRAGON_HOARD_INTRUDER', // 40% gated conditional
  },
};
