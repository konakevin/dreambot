/**
 * BloomBot rain-garden — storm-light drenched blooms (Stage A4). Saturated wet
 * color, visible rain, droplets, petals on wet stone. Rides the default
 * LUSH_HERO_MANDATE (wet blooms fill the frame). Template uses storm_light for
 * the light (never the sunny lighting pool). Rain always VISIBLE; rain DEEPENS
 * color, never grays. No umbrellas/figures.
 */

module.exports = {
  archetype: 'BLOOMBOT_RAIN_GARDEN',
  pools: {
    garden_scene: 'BLOOMBOT_RAIN_GARDEN_SCENE',
    rain_state: 'BLOOMBOT_RAIN_GARDEN_RAIN_STATE',
    wet_detail: 'BLOOMBOT_RAIN_GARDEN_WET_DETAIL',
    storm_light: 'BLOOMBOT_RAIN_GARDEN_STORM_LIGHT',
    storm_event: 'BLOOMBOT_RAIN_GARDEN_STORM_EVENT',
  },
};
