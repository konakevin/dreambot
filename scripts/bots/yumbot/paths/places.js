/**
 * YumBot places path (2026-06-07 trial — bucket H).
 *
 * Fifth bucket-aggregated path. 6 unexpected-place sub-themes
 * (greenhouse / library / train / amusement-park / aquarium /
 * rooftop-garden) share axis pools.
 *
 * Inherits the bot-wide sharedDNA.lookRegister + yumbot_food_neutral medium.
 *
 * Re-gen via scripts/gen-seeds/yumbot/gen-places-*.js
 */

module.exports = {
  archetype: 'YUMBOT_PLACES',
  pools: {
    scene: 'YUMBOT_PLACES_SCENES',
    camera_framing: 'YUMBOT_PLACES_CAMERAS',
    lighting: 'YUMBOT_PLACES_LIGHTING',
    palette: 'YUMBOT_PLACES_PALETTES',
    time_of_day: 'YUMBOT_PLACES_TIME_OF_DAY',
    companion: 'YUMBOT_PLACES_COMPANIONS',
    decor_accents: 'YUMBOT_PLACES_DECOR',
    atmospheric_accent: 'YUMBOT_PLACES_ATMOSPHERIC_ACCENT',
  },
};
