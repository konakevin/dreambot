/**
 * ChibiBot creature-autumn-day (Stage H1, SHADOW) — outing-family clone. A little
 * band of chibi creature friends out on a cozy golden-autumn day (leaf-pile jumping,
 * pumpkin patch, apple orchard, cider stand, corn maze). Reuses the shared
 * CHIBIBOT_CREATURE_OUTING archetype + template; 4 autumn-bespoke pools + the shared
 * CUTE_CREATURES_UNIFIED cast (pickN:3). NO humans ever; golden-autumn cozy palette.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_OUTING',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    activity: 'CHIBIBOT_AUTUMN_DAY_ACTIVITY',
    setting_detail: 'CHIBIBOT_AUTUMN_DAY_DETAIL',
    prop: 'CHIBIBOT_AUTUMN_DAY_PROP',
    surprise_element: 'CHIBIBOT_AUTUMN_DAY_SURPRISE',
  },
};
