/**
 * ChibiBot creature-school (Stage H4, SHADOW) — interior outing-family clone. A cozy
 * little schoolroom of chibi creature pupils (and a creature teacher) doing a class
 * activity together (art class, show-and-tell with a glowing pebble, story circle,
 * chalkboard lesson, naptime). Reuses the shared CHIBIBOT_CREATURE_OUTING archetype +
 * template; 4 classroom pools + shared CUTE_CREATURES_UNIFIED cast (pickN:3). Teacher is
 * a CREATURE (NO humans ever); "children"/"kids" banned (creature pupils only); warm interior.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_OUTING',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    activity: 'CHIBIBOT_CREATURE_SCHOOL_ACTIVITY',
    setting_detail: 'CHIBIBOT_CREATURE_SCHOOL_DETAIL',
    prop: 'CHIBIBOT_CREATURE_SCHOOL_PROP',
    surprise_element: 'CHIBIBOT_CREATURE_SCHOOL_SURPRISE',
  },
};
