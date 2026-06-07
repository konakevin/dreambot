/**
 * YumBot fast-food path (2026-06-07 trial — bucket FF).
 *
 * 6 fast-food sub-themes (burger-joint / pizza-shop / taco-stand /
 * fried-classics / hot-dog-cart / diner-shake-and-fries).
 */
module.exports = {
  archetype: 'YUMBOT_FAST_FOOD',
  pools: {
    scene: 'YUMBOT_FAST_FOOD_SCENES',
    camera_framing: 'YUMBOT_FAST_FOOD_CAMERAS',
    lighting: 'YUMBOT_FAST_FOOD_LIGHTING',
    palette: 'YUMBOT_FAST_FOOD_PALETTES',
    time_of_day: 'YUMBOT_FAST_FOOD_TIME_OF_DAY',
    companion: 'YUMBOT_FAST_FOOD_COMPANIONS',
    decor_accents: 'YUMBOT_FAST_FOOD_DECOR',
    atmospheric_accent: 'YUMBOT_FAST_FOOD_ATMOSPHERIC_ACCENT',
  },
};
