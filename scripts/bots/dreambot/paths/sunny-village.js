/**
 * ChibiBot sunny-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO Mediterranean / sun-drenched village. Bougainvillea-clad
 * cottages / Santorini cliff-villages / terracotta-roof clusters / Tuscan
 * olive-grove villages / palm-fringed hamlets / sun-bleached pueblos. SOLO
 * creature filtered to LAND/BIRD-tagged (+ ANY-wildcard).
 *
 * 10 axes. Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_SUNNY_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['LAND', 'BIRD', 'ANY'] },
    resident_activity: 'SUNNY_VILLAGE_ACTIVITIES',
    village: 'SUNNY_VILLAGE_SETTINGS',
    village_detail: 'SUNNY_VILLAGE_DETAILS',
    time_of_day: 'SUNNY_VILLAGE_TIME_OF_DAY',
    surprise_element: 'SUNNY_VILLAGE_SURPRISE',
    phenomenon: 'SUNNY_VILLAGE_PHENOMENA',
  },
};
