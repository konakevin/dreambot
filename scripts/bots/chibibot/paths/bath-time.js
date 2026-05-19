/**
 * ChibiBot bath-time path — full-bespoke axis-system (2026-05-19).
 *
 * Adorable creature(s) in tiny cozy baths — bubbles, rubber ducks, foam on
 * noses, towel turbans, steamy spa-day-for-tiny-creatures bliss. Bespoke
 * axes per BOT_SCENE_QUALITY_PLAYBOOK.
 *
 * Axes (11 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather
 *   Reused from heartwarming-scene: time_of_day (HEARTWARMING_TIME_OF_DAY)
 *   Path-bespoke: setting (bath vessel + location), activity, creature_1,
 *                 amenity (pickN:2), surprise_element, phenomenon
 *   Conditional 70%-gated: creature_2 (group vs solo)
 *   Template-gated 60%: phenomenon (drama / magical event)
 *
 * Amenity pickN:2 because bath cuteness amplifies with stacked props
 * (rubber duck + candle / towel + soap / etc.).
 */

module.exports = {
  archetype: 'CHIBIBOT_BATH_TIME',
  pools: {
    creature_1: 'CUTE_CREATURES',
    creature_2: 'CUTE_CREATURES',
    activity: 'BATH_TIME_ACTIVITIES',
    setting: 'BATH_TIME_SETTINGS',
    time_of_day: 'HEARTWARMING_TIME_OF_DAY',
    amenity: 'BATH_TIME_AMENITIES',
    surprise_element: 'BATH_TIME_SURPRISE_ELEMENTS',
    phenomenon: 'BATH_TIME_PHENOMENA',
  },
};
