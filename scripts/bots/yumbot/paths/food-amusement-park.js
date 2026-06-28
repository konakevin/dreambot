/**
 * YumBot food-amusement-park path (2026-06-28).
 *
 * One of 8 per-setting paths promoted from food-adventures. Uses the SAME proven
 * food-adventures architecture (YUMBOT_FOOD_ADVENTURES scene-led archetype +
 * template + the shared narrative secondary axes) — the cast + action + a richly-
 * named amusement-park location are BAKED into each scene (that's what forces the
 * environment to render, vs YumBot's flat-lay/product prior). Just a deeper,
 * single-setting scene pool (sub-bucketed by ride type).
 */
module.exports = {
  archetype: 'YUMBOT_FOOD_ADVENTURES',
  pools: {
    scene: 'YUMBOT_AMUSEMENT_PARK_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
