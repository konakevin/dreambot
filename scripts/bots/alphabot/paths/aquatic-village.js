/**
 * ChibiBot aquatic-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO underwater/coastal village. Coral-towers / kelp-cottages /
 * pearl-shell hamlets / submarine-ports / tidepool villages / sea-cave
 * dwellings / floating lily-pad clusters / bioluminescent grottos. SOLO
 * creature filtered to MARINE-tagged from unified pool (+ ANY-wildcard).
 *
 * 10 axes. Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_AQUATIC_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['MARINE', 'ANY'] },
    resident_activity: 'AQUATIC_VILLAGE_ACTIVITIES',
    village: 'AQUATIC_VILLAGE_SETTINGS',
    village_detail: 'AQUATIC_VILLAGE_DETAILS',
    time_of_day: 'AQUATIC_VILLAGE_TIME_OF_DAY',
    surprise_element: 'AQUATIC_VILLAGE_SURPRISE',
    phenomenon: 'AQUATIC_VILLAGE_PHENOMENA',
  },
};
