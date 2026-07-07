/**
 * ChibiBot arctic-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO snow/ice/arctic village. Snow-cottage rows / igloo clusters /
 * log-cabins under aurora / mountain-chalets / fishing-villages on frozen lakes.
 * SOLO creature filtered to ARCTIC-tagged from unified pool (+ ANY-wildcard)
 * does a story-driven activity in the foreground.
 *
 * 10 axes: 3 universal + 7 path-bespoke.
 * Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_ARCTIC_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['ARCTIC', 'ANY'] },
    resident_activity: 'ARCTIC_VILLAGE_ACTIVITIES',
    village: 'ARCTIC_VILLAGE_SETTINGS',
    village_detail: 'ARCTIC_VILLAGE_DETAILS',
    time_of_day: 'ARCTIC_VILLAGE_TIME_OF_DAY',
    surprise_element: 'ARCTIC_VILLAGE_SURPRISE',
    phenomenon: 'ARCTIC_VILLAGE_PHENOMENA',
  },
};
