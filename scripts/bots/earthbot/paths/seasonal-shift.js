/**
 * EarthBot seasonal-shift path — declarative axis-system (2026-05-22 R2 rich).
 *
 * Dramatic seasonal landscape scenes — multi-color autumn fire, fresh
 * winter snow with lingering color, cherry-blossom + wildflower spring,
 * golden summer meadows. THE SEASON IS THE SUBJECT.
 *
 * 9 axes — 8 always-on + 1 conditional 30%-gated phenomenon. Designed
 * for RICH multi-layer renders with mandatory color variety per season.
 *
 * SEASON-COHERENT TAG MATCHING: subject rolls FIRST and sets the season
 * tag (autumn / winter / spring / summer). color_palette + depth_layers
 * + seasonal_motion all roll with matchTagsFromSlot=subject so all
 * season-tagged content stays coherent within a single render. (Picks
 * an autumn palette + autumn depth-layers + autumn motion when subject
 * rolls autumn, etc.)
 *
 * Bespoke pools (4): subject + color_palette + depth_layers + seasonal_motion.
 * Reused EPIC_VISTA pools (5): lighting + atmosphere + hero_feature +
 * sky_layer + phenomenon (all 200-entry production, all trigger-purged).
 *
 * Trigger-purge baked in:
 * - NO named places (legacy had Colorado / Vermont / Kyoto / Texas)
 * - NO bioluminescent / phosphorescent (sci-fi trigger)
 * - NO mono-color entries — every entry must reference 3-5 contrasting colors
 * - NO single beam / single shaft (laser trigger)
 * - NO humans / architecture / cabins / fences / roads
 *
 * Legacy implementation preserved at paths/legacy/seasonal-shift.js.
 */

module.exports = {
  archetype: 'EARTHBOT_SEASONAL_SHIFT',
  pools: {
    // subject rolls FIRST — sets the season tag for downstream slots
    subject: 'SEASONAL_SHIFT_SUBJECT',
    // these 5 axes filter by the subject's season tag for coherence —
    // autumn rolls draw autumn-coded color/depth/motion/hero/phenomenon,
    // spring rolls draw spring-coded equivalents. Prevents cross-season
    // bleed (e.g. autumn hawk on spring scene, or autumn alpenglow phenomenon
    // on a cherry-blossom subject).
    color_palette: { name: 'SEASONAL_SHIFT_COLOR_PALETTE', matchTagsFromSlot: 'subject' },
    depth_layers: { name: 'SEASONAL_SHIFT_DEPTH_LAYERS', matchTagsFromSlot: 'subject' },
    seasonal_motion: { name: 'SEASONAL_SHIFT_SEASONAL_MOTION', matchTagsFromSlot: 'subject' },
    hero_feature: { name: 'SEASONAL_SHIFT_HERO_FEATURE', matchTagsFromSlot: 'subject' },
    phenomenon: { name: 'SEASONAL_SHIFT_PHENOMENON', matchTagsFromSlot: 'subject' },
    // reused EPIC_VISTA pools — season-agnostic physics (golden hour is
    // golden hour regardless of season; clouds and atmospheric haze too)
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    sky_layer: 'EPIC_VISTA_SKY',
  },
};
