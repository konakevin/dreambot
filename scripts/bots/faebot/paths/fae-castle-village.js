/**
 * FaeBot fae-castle-village path (2026-06-10). A HYBRID of elven-city (white
 * elven architecture + soft fairy touches) and fae-village (cozy village
 * layout) — an ethereal, castle-like fae village: a cluster of little white
 * elven spired cottages linked by archways + bridges, nestled in lush forest.
 * Self-contained axes. MVP-25.
 */
module.exports = {
  archetype: 'FAEBOT_CASTLE_VILLAGE',
  pools: {
    village_layout: 'FAEBOT_CASTLE_VILLAGE_LAYOUT',
    village_detail: 'FAEBOT_CASTLE_VILLAGE_DETAIL',
    setting: 'FAEBOT_CASTLE_VILLAGE_SETTING',
    inhabitants: 'FAEBOT_CASTLE_VILLAGE_INHABITANTS',
    fae_lighting: 'FAEBOT_CASTLE_VILLAGE_LIGHTING',
    drama: 'FAEBOT_CASTLE_VILLAGE_DRAMA', // 40% gated conditional
  },
};
