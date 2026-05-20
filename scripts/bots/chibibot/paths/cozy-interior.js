/**
 * ChibiBot cozy-interior path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO indoor cozy space. Living-room / kitchen / library /
 * bedroom / café / hobbit-hole. SOLO peripheral creature does a story-
 * driven activity. WIDE establishing shot — room fills frame.
 *
 * 10 axes: 3 universal + 7 path-bespoke. Pixar-medium-locked. Skip polish.
 */

module.exports = {
  archetype: 'CHIBIBOT_COZY_INTERIOR',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED' },
    resident_activity: 'COZY_INTERIOR_ACTIVITIES',
    room: 'COZY_INTERIOR_ROOMS',
    room_detail: 'COZY_INTERIOR_DETAILS',
    time_of_day: 'COZY_INTERIOR_TIME_OF_DAY',
    surprise_element: 'COZY_INTERIOR_SURPRISE',
    phenomenon: 'COZY_INTERIOR_PHENOMENA',
  },
};
