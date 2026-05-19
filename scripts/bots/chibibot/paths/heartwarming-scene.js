/**
 * ChibiBot heartwarming-scene path — full-bespoke axis-system (2026-05-19).
 *
 * The "OMG IT'S TOO CUTE. I CAN'T." cuddle moment — adorable creature(s)
 * doing something heart-melting in a deliberately-chosen storybook setting,
 * under a deliberately-chosen time-of-day, with deliberate weather and an
 * optional environmental phenomenon. Bespoke axes per BOT_SCENE_QUALITY_PLAYBOOK.
 *
 * Axes (10 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather (NEW: SCENE_WEATHER)
 *   Path-bespoke: setting, time_of_day, creature_1, activity, surprise_element
 *   Conditional 70%-gated: creature_2 (matches legacy isGroup probability)
 *   Conditional 60%-gated: phenomenon (drama / magical event)
 */

module.exports = {
  archetype: 'CHIBIBOT_HEARTWARMING_SCENE',
  pools: {
    creature_1: 'CUTE_CREATURES',
    creature_2: 'CUTE_CREATURES',
    activity: 'HEARTWARMING_ACTIVITIES',
    setting: 'HEARTWARMING_SETTINGS',
    time_of_day: 'HEARTWARMING_TIME_OF_DAY',
    surprise_element: 'HEARTWARMING_SURPRISE_ELEMENTS',
    phenomenon: 'HEARTWARMING_PHENOMENA',
  },
};
