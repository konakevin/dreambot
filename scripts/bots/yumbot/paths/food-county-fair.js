/**
 * YumBot food-county-fair path (2026-06-28). Food-adventures architecture + a
 * deep single-setting county-fair scene pool (cast + action + rich location baked
 * in) — daytime fair games + midway, distinct from the amusement-park coasters.
 */
module.exports = {
  archetype: 'YUMBOT_FOOD_ADVENTURES',
  pools: {
    scene: 'YUMBOT_COUNTY_FAIR_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
