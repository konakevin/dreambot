/**
 * YumBot candy-fantasy path — Wreck-It-Ralph Sugar Rush world.
 *
 * R3 (2026-05-21): split scene_type / time_of_day / weather as independent
 * axes; regenerated camera + lighting with scene-aware variety. 12 path-bespoke
 * axes drive composition variety (picnics, villages, parks, camping, festivals,
 * tea parties, markets, garden parties — not all wide-vista landscape shots).
 */

module.exports = {
  archetype: 'YUMBOT_CANDY_FANTASY',
  pools: {
    // Path-bespoke Sugar Rush world pools
    candy_landscape: 'CANDY_FANTASY_LANDSCAPE',
    candy_scene_type: 'CANDY_FANTASY_SCENE_TYPE',
    candy_world_signature: 'CANDY_FANTASY_SIGNATURE',
    candy_terrain: 'CANDY_FANTASY_TERRAIN',
    candy_sky: 'CANDY_FANTASY_SKY',
    candy_camera: 'CANDY_FANTASY_CAMERA',
    candy_lighting: 'CANDY_FANTASY_LIGHTING',
    candy_time_of_day: 'CANDY_FANTASY_TIME_OF_DAY',
    candy_weather: 'CANDY_FANTASY_WEATHER',

    // Shared catalogs filtered by CANDY_FANTASY tag
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['CANDY_FANTASY'] },
    companions: { name: 'TINY_COMPANIONS', tags: ['CANDY_FANTASY'] },
    decor_accents: { name: 'DECOR_ITEMS', tags: ['CANDY_FANTASY'] },
    night_mode: 'KAWAII_NIGHT_AUGMENT',
  },
};
