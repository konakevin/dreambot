/**
 * DragonBot arcane-library path (2026-06-10, Tier 3). A Rivendell-style ANCIENT
 * HIGH-ELVEN library — warm, candlelit, cozy (refactored 2026-06-17). Default
 * painted_fantasy_novel medium. set_pieces axis (pickN:2 lived-in trinkets)
 * added 2026-06-17 for whimsical character.
 */
module.exports = {
  archetype: 'ARCANE_LIBRARY',
  pools: {
    library: 'ARCLIB_LIBRARY',
    arcane_detail: 'ARCLIB_DETAIL',
    library_feature: 'ARCLIB_FEATURE',
    occupant: 'ARCLIB_OCCUPANT',
    set_pieces: 'ARCLIB_SET_PIECES', // pickN:2 — whimsical lived-in trinkets/curios
    drama: 'ARCLIB_DRAMA', // 40% gated conditional
  },
};
