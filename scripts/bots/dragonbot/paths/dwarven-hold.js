/**
 * DragonBot dwarven-hold path (2026-06-10, NEW, Tier 3). A vast underground
 * dwarven kingdom — colossal carved halls, forges, gold. Default
 * painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DWARVEN_HOLD',
  pools: {
    hold: 'DWARFHOLD_HALL',
    dwarven_detail: 'DWARFHOLD_DETAIL',
    forge_activity: 'DWARFHOLD_FORGE',
    occupant: 'DWARFHOLD_OCCUPANT',
    drama: 'DWARFHOLD_DRAMA', // 40% gated conditional
  },
};
