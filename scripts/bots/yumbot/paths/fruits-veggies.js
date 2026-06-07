/**
 * YumBot fruits-veggies path (2026-06-07 trial — bucket FV).
 *
 * Seventh bucket-aggregated path. 6 organic-environment sub-themes share
 * axis pools (vegetable-garden / fruit-tree / vine-and-bush / harvest-basket
 * / forest-forage / farmers-market). Each scene features a kawaii
 * fruit/veggie HOST + 1-2 kawaii dessert FRIENDS.
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral medium.
 *
 * Re-gen via scripts/gen-seeds/yumbot/gen-fruits-veggies-*.js
 */

module.exports = {
  archetype: 'YUMBOT_FRUITS_VEGGIES',
  pools: {
    scene: 'YUMBOT_FRUITS_VEGGIES_SCENES',
    camera_framing: 'YUMBOT_FRUITS_VEGGIES_CAMERAS',
    lighting: 'YUMBOT_FRUITS_VEGGIES_LIGHTING',
    palette: 'YUMBOT_FRUITS_VEGGIES_PALETTES',
    time_of_day: 'YUMBOT_FRUITS_VEGGIES_TIME_OF_DAY',
    companion: 'YUMBOT_FRUITS_VEGGIES_COMPANIONS',
    decor_accents: 'YUMBOT_FRUITS_VEGGIES_DECOR',
    atmospheric_accent: 'YUMBOT_FRUITS_VEGGIES_ATMOSPHERIC_ACCENT',
  },
};
