/**
 * DragonBot dungeon-delve path (2026-06-10, NEW, Tier 2). A small party
 * exploring torch-lit fantasy depths — treasure, bones, lurking monsters.
 * Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DUNGEON_DELVE',
  pools: {
    dungeon: 'DUNGEON_CHAMBER',
    party: 'DUNGEON_PARTY',
    dungeon_detail: 'DUNGEON_DETAIL',
    lurking_threat: 'DUNGEON_THREAT',
    drama: 'DUNGEON_DRAMA', // 40% gated conditional
  },
};
