/**
 * YumBot food-water-park path (2026-06-28). One of 8 per-setting paths promoted
 * from food-adventures. Food-adventures architecture (cast + action + rich
 * location baked into each scene) + a deep single-setting water-park scene pool.
 */
module.exports = {
  archetype: 'YUMBOT_FOOD_ADVENTURES',
  pools: {
    scene: 'YUMBOT_WATER_PARK_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
