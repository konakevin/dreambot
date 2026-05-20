/**
 * ChibiBot cottagecore-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO English-countryside cottagecore village. Thatched-roof
 * clusters / windmills / lavender-field cottages / apple-orchard hamlets /
 * wisteria-tunnel villages / cobblestone lanes / mushroom-cottage clusters.
 * SOLO creature filtered to LAND/FANTASY-tagged (+ ANY-wildcard).
 *
 * 10 axes. Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_COTTAGECORE_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['LAND', 'FANTASY', 'ANY'] },
    resident_activity: 'COTTAGECORE_VILLAGE_ACTIVITIES',
    village: 'COTTAGECORE_VILLAGE_SETTINGS',
    village_detail: 'COTTAGECORE_VILLAGE_DETAILS',
    time_of_day: 'COTTAGECORE_VILLAGE_TIME_OF_DAY',
    surprise_element: 'COTTAGECORE_VILLAGE_SURPRISE',
    phenomenon: 'COTTAGECORE_VILLAGE_PHENOMENA',
  },
};
