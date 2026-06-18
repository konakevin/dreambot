/**
 * DragonBot dragon-lair path (2026-06-17, NEW). COZY, CLOSE-IN scenes of eggs +
 * baby dragons INSIDE a lair — the lair is just the warm interior SETTING (a snug
 * hoard-gold nook), the scene stays intimate and close (NOT a wide epic vista).
 * The lair-set counterpart to dragon-nest (varied outdoor/den settings). Reuses
 * the realistic dragnest baby-dragon / mother / drama pools. ~30% of renders are
 * a high-fidelity CLOSE-UP of magical eggs. Realistic painted Western dragons
 * (NOT cartoon). Default painted_fantasy_novel medium.
 */
module.exports = {
  archetype: 'DRAGON_LAIR',
  pools: {
    lair: 'DRAGONLAIR_LAIR', // cozy close-in lair-interior nook (the warm setting)
    nests: 'DRAGONLAIR_NESTS', // the nest + clutch of eggs
    broodlings: 'DRAGNEST_BROODLINGS', // the realistic baby dragons (reused)
    lair_detail: 'DRAGONLAIR_DETAIL', // pickN:2 — hoard / crystals (clean, no meat)
    mother: 'DRAGNEST_MOTHER', // 65% gated — optional tending mother (reused)
    drama: 'DRAGNEST_DRAMA', // 40% gated conditional beat (reused)
  },
};
