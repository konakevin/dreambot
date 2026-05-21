/**
 * YumBot mini-chef path — kawaii kitchen scenes (12-axis).
 *
 * Composition-locked kawaii kitchen scenes — 5 kawaii food-characters wearing
 * tiny chef outfits (mini chef hats, aprons, neckerchiefs) gathered in a
 * kawaii kitchen preparing a kawaii dish. Natural family-portrait cluster
 * with slight pose variation, rich kitchen backdrop, painterly Pop-Mart
 * Studio-Ghibli kitchen warmth.
 *
 * Full 12-axis architecture: scene_type, kitchen_backdrop, 2 signatures,
 * terrain, sky, camera, lighting, time_of_day, atmosphere, food (5),
 * companion (1), dish_being_prepared (1 — the centerpiece dish).
 *
 * Built 2026-05-21.
 */

module.exports = {
  archetype: 'YUMBOT_MINI_CHEF',
  pools: {
    scene_type: 'CHEF_SCENE_TYPE',
    kitchen_backdrop: 'CHEF_KITCHEN_BACKDROP',
    signature: 'CHEF_SIGNATURE',
    terrain: 'CHEF_TERRAIN',
    sky: 'CHEF_SKY',
    camera: 'CHEF_CAMERA',
    lighting: 'CHEF_LIGHTING',
    time_of_day: 'CHEF_TIME_OF_DAY',
    atmosphere: 'CHEF_ATMOSPHERE',
    companion: 'CHEF_COMPANION',
    dish_being_prepared: 'CHEF_DISH_BEING_PREPARED',
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['BAKERY'] },
  },
};
