/**
 * DragonBot wizard-tower path (2026-06-10, NEW, Tier 3). A wizard's tower
 * dense with arcana — interior or exterior. Default painted_fantasy_novel
 * medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'WIZARD_TOWER',
  pools: {
    tower: 'WIZTOWER_TOWER',
    arcane_detail: 'WIZTOWER_ARCANA',
    tower_setting: 'WIZTOWER_SETTING',
    occupant: 'WIZTOWER_OCCUPANT',
    drama: 'WIZTOWER_DRAMA', // 40% gated conditional
  },
};
