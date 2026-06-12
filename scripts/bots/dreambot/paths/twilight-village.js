/**
 * ChibiBot twilight-village path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO dusk/lantern/firefly-magic village. Lantern-lane / firefly
 * meadow cottages / moonlit-bridge towns / Spirited-Away-paper-lantern towns
 * / bioluminescent gardens / glowworm caves / moonflower meadows. SOLO
 * creature filtered to LAND/FANTASY-tagged (+ ANY-wildcard).
 *
 * 10 axes. Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_TWILIGHT_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['LAND', 'FANTASY', 'ANY'] },
    resident_activity: 'TWILIGHT_VILLAGE_ACTIVITIES',
    village: 'TWILIGHT_VILLAGE_SETTINGS',
    village_detail: 'TWILIGHT_VILLAGE_DETAILS',
    time_of_day: 'TWILIGHT_VILLAGE_TIME_OF_DAY',
    surprise_element: 'TWILIGHT_VILLAGE_SURPRISE',
    phenomenon: 'TWILIGHT_VILLAGE_PHENOMENA',
  },
};
