/**
 * DragonBot dragon-battle path (2026-06-10, NEW). A colossal Western dragon
 * mid-combat — fire on a castle/army, or clashing with a rival. Action
 * spectacle. Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DRAGON_BATTLE',
  pools: {
    dragon: 'DRAGON_BATTLE_DRAGON',
    combat_action: 'DRAGON_BATTLE_ACTION',
    target: 'DRAGON_BATTLE_TARGET',
    battle_setting: 'DRAGON_BATTLE_SETTING',
    drama: 'DRAGON_BATTLE_DRAMA', // 40% gated conditional
  },
};
