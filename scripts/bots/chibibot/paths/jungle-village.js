/**
 * ChibiBot jungle-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO jungle village. Treehouses / mushroom-houses / vine-bridges /
 * canopy platforms. SOLO creature filtered to JUNGLE-tagged from unified pool
 * (+ ANY-wildcard) does a story-driven activity in the foreground.
 *
 * 10 axes: 3 universal + 7 path-bespoke.
 * Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_JUNGLE_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['JUNGLE'] },
    resident_activity: 'JUNGLE_VILLAGE_ACTIVITIES',
    village: 'JUNGLE_VILLAGE_SETTINGS',
    village_detail: 'JUNGLE_VILLAGE_DETAILS',
    time_of_day: 'JUNGLE_VILLAGE_TIME_OF_DAY',
    surprise_element: 'JUNGLE_VILLAGE_SURPRISE',
    phenomenon: 'JUNGLE_VILLAGE_PHENOMENA',
  },
};
