/**
 * YumBot narrative path (2026-06-07 trial — bucket F).
 *
 * Sixth bucket-aggregated path. 6 narrative-action sub-themes share axis
 * pools (baking-in-progress / garden-harvest / pastry-shop-window /
 * food-parade / food-tea-party / bakery-delivery).
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral medium.
 *
 * Re-gen via scripts/gen-seeds/yumbot/gen-narrative-*.js
 */

module.exports = {
  archetype: 'YUMBOT_NARRATIVE',
  pools: {
    scene: 'YUMBOT_NARRATIVE_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
