/**
 * YumBot whimsical path (2026-06-07 trial — bucket I).
 *
 * Second bucket-aggregated path after meal-types. 6 whimsical-concept
 * sub-themes share axis pools (food-with-pets / food-fashion-show /
 * food-spa / food-orchestra / food-school / food-and-toys). Each scene
 * entry is a tagged structured object — sub-theme baked into scene.
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral
 * medium (via mediumByPath in index.js) so each render rolls a different
 * cute visual treatment.
 *
 * Re-gen pools by running:
 *   node scripts/gen-seeds/yumbot/gen-whimsical-scenes.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-cameras.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-lighting.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-palettes.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-time-of-day.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-companions.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-decor.js
 *   node scripts/gen-seeds/yumbot/gen-whimsical-atmospheric-accent.js
 */

module.exports = {
  archetype: 'YUMBOT_WHIMSICAL',
  pools: {
    scene: 'YUMBOT_WHIMSICAL_SCENES',
    camera_framing: 'YUMBOT_WHIMSICAL_CAMERAS',
    lighting: 'YUMBOT_WHIMSICAL_LIGHTING',
    palette: 'YUMBOT_WHIMSICAL_PALETTES',
    time_of_day: 'YUMBOT_WHIMSICAL_TIME_OF_DAY',
    companion: 'YUMBOT_WHIMSICAL_COMPANIONS',
    decor_accents: 'YUMBOT_WHIMSICAL_DECOR',
    atmospheric_accent: 'YUMBOT_WHIMSICAL_ATMOSPHERIC_ACCENT',
  },
};
