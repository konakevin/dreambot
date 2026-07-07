/**
 * ChibiBot rainy-day-cozy path — full-bespoke axis-system (2026-05-19).
 *
 * GROUP-OF-FRIENDS SHELTERED-FROM-RAIN cozy moments. 2-4 chibi friends
 * huddled together in cozy outdoor shelters (mushroom caps / porches /
 * umbrellas / hollow logs / stone arches) during rain. Sister path to
 * rainy-interior (friends OUT IN the rain playing); this one is friends
 * SHELTERED warmly with rain visibly falling around the shelter.
 *
 * Pixar-medium-locked. Two-pass-polish skipped.
 *
 * 10 axes: 3 universal + 7 path-bespoke.
 */

module.exports = {
  archetype: 'CHIBIBOT_RAINY_DAY_COZY',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    huddle_activity: 'RAINY_DAY_COZY_HUDDLES',
    shelter: 'RAINY_DAY_COZY_SHELTERS',
    detail: 'RAINY_DAY_COZY_DETAILS',
    time_of_day: 'RAINY_DAY_COZY_TIME_OF_DAY',
    surprise_element: 'RAINY_DAY_COZY_SURPRISE',
    phenomenon: 'RAINY_DAY_COZY_PHENOMENA',
  },
};
