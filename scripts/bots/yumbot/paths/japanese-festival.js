/**
 * YumBot japanese-festival path — kawaii matsuri scenes (11-axis).
 *
 * Composition-locked Japanese-festival scenes — 5 kawaii Japanese festival
 * foods composed in matsuri/market settings. Full 11-axis architecture
 * matching candy-fantasy pattern: scene_type, market_backdrop, signature
 * (×2), terrain, sky, camera, lighting, time_of_day, weather, food (×5),
 * companion (×1).
 *
 * Built 2026-05-21. Reverted to R2 composed-lineup composition after the
 * R3-R5 playful-interactions attempt — Kevin preferred clean composed shots.
 */

module.exports = {
  archetype: 'YUMBOT_JAPANESE_FESTIVAL',
  pools: {
    scene_type: 'FESTIVAL_SCENE_TYPE',
    market_backdrop: 'FESTIVAL_MARKET_BACKDROP',
    signature: 'FESTIVAL_SIGNATURE',
    terrain: 'FESTIVAL_TERRAIN',
    sky: 'FESTIVAL_SKY',
    camera: 'FESTIVAL_CAMERA',
    lighting: 'FESTIVAL_LIGHTING',
    time_of_day: 'FESTIVAL_TIME_OF_DAY',
    weather: 'FESTIVAL_WEATHER',
    companion: 'FESTIVAL_COMPANION',
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['FESTIVAL'] },
  },
};
