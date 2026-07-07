/**
 * ChibiBot outdoor-adventure path — full-bespoke axis-system (2026-05-20).
 *
 * SOLO creature in the WILD/OPEN WORLD — pure wilderness scene with NO
 * village/architecture. Forest / mountain / cave / canyon / river / cliff /
 * lake / hill / desert / coastline / glacier / waterfall / jungle-floor etc.
 * Creature mid-adventure-pose (climbing / wading / hiking / mid-leap / etc).
 *
 * 10 axes. Pixar-medium-locked. Skip two-pass polish.
 */

module.exports = {
  archetype: 'CHIBIBOT_OUTDOOR_ADVENTURE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED' },
    adventure_activity: 'OUTDOOR_ADVENTURE_ACTIVITIES',
    wilderness_setting: 'OUTDOOR_ADVENTURE_WILDERNESS',
    wilderness_detail: 'OUTDOOR_ADVENTURE_DETAILS',
    adventure_prop: 'OUTDOOR_ADVENTURE_PROPS',
    time_of_day: 'OUTDOOR_ADVENTURE_TIME_OF_DAY',
    surprise_element: 'OUTDOOR_ADVENTURE_SURPRISE',
  },
};
