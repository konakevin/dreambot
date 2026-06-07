/**
 * YumBot meal-types path (2026-06-06 trial).
 *
 * Bucket-aggregated path: ONE scene pool covers 6 meal-occasion sub-themes
 * (breakfast / high-tea / picnic / coffee-shop / food-truck / midnight-snack).
 * Each scene entry is a tagged structured object — the sub-theme is baked
 * into the scene description so other axes (camera / lighting / palette /
 * time_of_day / companion / decor / atmospheric_accent) stay shared across
 * the whole bucket. Trial pool sizes: 30 scenes (5 per sub-theme) + 7 axes
 * × 25 each.
 *
 * If the trial reads well, scale each sub-theme to 25 + axes to 50 and
 * replicate the pattern for the other 7 buckets.
 *
 * Re-gen pools by running:
 *   node scripts/gen-seeds/yumbot/gen-meal-types-scenes.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-cameras.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-lighting.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-palettes.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-time-of-day.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-companions.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-decor.js
 *   node scripts/gen-seeds/yumbot/gen-meal-types-atmospheric-accent.js
 */

module.exports = {
  archetype: 'YUMBOT_MEAL_TYPES',
  pools: {
    scene: 'YUMBOT_MEAL_TYPES_SCENES',
    camera_framing: 'YUMBOT_MEAL_TYPES_CAMERAS',
    lighting: 'YUMBOT_MEAL_TYPES_LIGHTING',
    palette: 'YUMBOT_MEAL_TYPES_PALETTES',
    time_of_day: 'YUMBOT_MEAL_TYPES_TIME_OF_DAY',
    companion: 'YUMBOT_MEAL_TYPES_COMPANIONS',
    decor_accents: 'YUMBOT_MEAL_TYPES_DECOR',
    atmospheric_accent: 'YUMBOT_MEAL_TYPES_ATMOSPHERIC_ACCENT',
  },
};
