/**
 * YumBot scale path (2026-06-07 trial — bucket D).
 *
 * Fourth bucket-aggregated path. 6 scale-twist sub-themes share axis pools
 * (giant-real-world / microscopic / food-island / chocolate-river /
 * underwater / food-in-space).
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral medium.
 *
 * Re-gen via scripts/gen-seeds/yumbot/gen-scale-*.js
 */

module.exports = {
  archetype: 'YUMBOT_SCALE',
  pools: {
    scene: 'YUMBOT_SCALE_SCENES',
    camera_framing: 'YUMBOT_SCALE_CAMERAS',
    lighting: 'YUMBOT_SCALE_LIGHTING',
    palette: 'YUMBOT_SCALE_PALETTES',
    time_of_day: 'YUMBOT_SCALE_TIME_OF_DAY',
    companion: 'YUMBOT_SCALE_COMPANIONS',
    decor_accents: 'YUMBOT_SCALE_DECOR',
    atmospheric_accent: 'YUMBOT_SCALE_ATMOSPHERIC_ACCENT',
  },
};
