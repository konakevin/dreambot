/**
 * YumBot food-outings path (2026-06-28) — the catch-all for the new food-outing
 * family. A multi-setting scene pool (food-adventures architecture) covering the
 * 12 leftover "out in the world" settings not promoted to their own paths:
 * mall / zoo / snow-day / skatepark / pool-party / park / movie-theater /
 * stadium / aquarium / carnival-night / backyard-cookout / road-trip.
 * (The original food-adventures path is left untouched and still covers all 20.)
 */
module.exports = {
  archetype: 'YUMBOT_FOOD_ADVENTURES',
  pools: {
    scene: 'YUMBOT_FOOD_OUTINGS_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
