/**
 * YumBot cuisine path (2026-06-07 trial — bucket C).
 *
 * Third bucket-aggregated path. 7 global-cuisine sub-themes share axis
 * pools (french-patisserie / italian-trattoria / mexican-fiesta /
 * korean-dessert-cafe / indian-sweet-shop / middle-eastern-souk /
 * nordic-bakery). Each scene entry is a tagged structured object.
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral
 * medium so each render rolls a different cute visual treatment.
 *
 * Re-gen pools:
 *   node scripts/gen-seeds/yumbot/gen-cuisine-scenes.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-cameras.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-lighting.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-palettes.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-time-of-day.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-companions.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-decor.js
 *   node scripts/gen-seeds/yumbot/gen-cuisine-atmospheric-accent.js
 */

module.exports = {
  archetype: 'YUMBOT_CUISINE',
  pools: {
    scene: 'YUMBOT_CUISINE_SCENES',
    camera_framing: 'YUMBOT_CUISINE_CAMERAS',
    lighting: 'YUMBOT_CUISINE_LIGHTING',
    palette: 'YUMBOT_CUISINE_PALETTES',
    time_of_day: 'YUMBOT_CUISINE_TIME_OF_DAY',
    companion: 'YUMBOT_CUISINE_COMPANIONS',
    decor_accents: 'YUMBOT_CUISINE_DECOR',
    atmospheric_accent: 'YUMBOT_CUISINE_ATMOSPHERIC_ACCENT',
  },
};
