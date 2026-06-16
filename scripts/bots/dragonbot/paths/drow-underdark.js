/**
 * DragonBot drow-underdark path (2026-06-15, NEW, Tier 1). A dark-elf city in
 * the lightless Underdark — obsidian spires, spider motifs, faerie-fire glow.
 * SELF-LIT: supplies its own underdark_light axis (universal lighting/atmosphere
 * are sky-coded and would inject sunlight into a lightless cavern). Default
 * painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DROW_UNDERDARK',
  pools: {
    drow_city: 'DROW_CITY',
    underdark_detail: 'UNDERDARK_DETAIL',
    drow_cavern: 'DROW_CAVERN',
    drow_occupant: 'DROW_OCCUPANT',
    underdark_light: 'UNDERDARK_LIGHT',
    drama: 'DROW_DRAMA', // 40% gated conditional
  },
};
