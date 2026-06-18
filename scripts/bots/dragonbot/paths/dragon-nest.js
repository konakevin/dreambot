/**
 * DragonBot dragon-nest path (2026-06-17, NEW). A tender behind-the-scenes look
 * at baby dragons — a clutch of eggs and broodlings in their nest, the cozy
 * counterpart to the epic adult-dragon paths (dragon-brood is MANY adults; this
 * is the nursery). Mother is OPTIONAL (65% gated) so some renders are pure
 * nursery and some have mom tending. Default painted_fantasy_novel medium.
 * MVP-25 pools.
 */
module.exports = {
  archetype: 'DRAGON_NEST',
  pools: {
    nest_setting: 'DRAGNEST_SETTING',
    clutch: 'DRAGNEST_CLUTCH',
    broodlings: 'DRAGNEST_BROODLINGS',
    nest_detail: 'DRAGNEST_DETAIL', // pickN:2 — cozy nest dressing
    mother: 'DRAGNEST_MOTHER', // 65% gated conditional (optional tending mother)
    drama: 'DRAGNEST_DRAMA', // 40% gated conditional (a tender beat)
  },
};
