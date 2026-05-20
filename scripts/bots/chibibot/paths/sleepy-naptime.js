/**
 * ChibiBot sleepy-naptime path — full-bespoke axis-system (2026-05-19).
 *
 * SOLO creature dozing in an impossibly cozy nap-spot. Peak-cute sleeping
 * moment. Mid-close framing. The viewer melts and whispers "shhh don't wake it".
 *
 * 10 axes: 3 universal + 7 path-bespoke.
 * Pixar-medium-locked. Two-pass-polish skipped.
 */

module.exports = {
  archetype: 'CHIBIBOT_SLEEPY_NAPTIME',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED' },
    sleep_pose: 'SLEEPY_NAPTIME_POSES',
    nap_spot: 'SLEEPY_NAPTIME_SPOTS',
    detail: 'SLEEPY_NAPTIME_DETAILS',
    time_of_day: 'SLEEPY_NAPTIME_TIME_OF_DAY',
    surprise_element: 'SLEEPY_NAPTIME_SURPRISE',
    phenomenon: 'SLEEPY_NAPTIME_PHENOMENA',
  },
};
