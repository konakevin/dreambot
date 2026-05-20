/**
 * ChibiBot miniature-feast path — full-bespoke axis-system (2026-05-19).
 *
 * KAWAII POP-MART FOOD scene with chibi creatures interacting with a
 * smiling-faced food hero. Sister to cute-food (which is food-only) —
 * this path is CHIBIS + FOOD together. Heavily decorated kawaii scene.
 *
 * 11 axes: 3 universal + 8 path-bespoke. chibibot_render medium lock.
 * Skip two-pass polish (scene-decoration language gets stripped).
 */

module.exports = {
  archetype: 'CHIBIBOT_MINIATURE_FEAST',
  pools: {
    food_hero: 'MINIATURE_FEAST_FOOD_HERO',
    scene_setting: 'MINIATURE_FEAST_SCENE_SETTING',
    creature_group: { name: 'CUTE_CREATURES_UNIFIED', tags: ['LAND', 'FANTASY', 'ANY'] },
    chibi_food_activity: 'MINIATURE_FEAST_CHIBI_ACTIVITY',
    food_decoration: 'MINIATURE_FEAST_FOOD_DECORATION',
    kawaii_atmosphere: 'MINIATURE_FEAST_KAWAII_ATMOSPHERE',
    time_of_day: 'MINIATURE_FEAST_TIME_OF_DAY',
    camera_angle: 'MINIATURE_FEAST_CAMERA_ANGLE',
  },
};
