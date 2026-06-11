/**
 * DragonBot clash-of-armies path (2026-06-10, NEW, Tier 2). An epic massed
 * fantasy battle — two armies clashing, siege + war-magic + banners, cinematic
 * scale. Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'CLASH_OF_ARMIES',
  pools: {
    armies: 'CLASH_ARMIES',
    battle_action: 'CLASH_ACTION',
    battlefield: 'CLASH_BATTLEFIELD',
    war_spectacle: 'CLASH_SPECTACLE',
    drama: 'CLASH_DRAMA', // 40% gated conditional
  },
};
