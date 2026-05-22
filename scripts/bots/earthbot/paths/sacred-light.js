/**
 * EarthBot sacred-light path — declarative axis-system (2026-05-21).
 *
 * Transcendent natural-light moments in nature — the LIGHT itself is
 * the hero. Mid/tight framing (not wide panorama). Dawn first-light
 * burning a single ridge while valleys remain in cool shadow, raking
 * shafts plural through old-growth canopy, alpenglow on snow-capped
 * peak, storm-break broad spotlight across a meadow, crepuscular rays
 * through cypress over a misty lake, sun-halo over winter forest.
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated phenomenon:
 * - subject (bespoke — sacred-light scene settings)
 * - lighting (bespoke — the sacred-light moment itself, hero of frame)
 * - atmosphere (REUSED — EPIC_VISTA_ATMOSPHERE)
 * - hero_feature (REUSED — EPIC_VISTA_HERO_FEATURE)
 * - sky_layer (REUSED — EPIC_VISTA_SKY)
 * - phenomenon (30%-gated, REUSED — EPIC_VISTA_PHENOMENON)
 *
 * Bespoke pools focus on the path identity (light-as-hero). Other axes
 * reuse EPIC_VISTA pools — same atmospheric mediums and sky behavior
 * work cross-path.
 *
 * Trigger-purge baked in (per geological-wonder R8 lessons):
 * - NO "single beam / single shaft / single column" (laser-beam trigger)
 * - NO "bioluminescent / phosphorescent / glowing" (sci-fi trigger)
 * - NO architecture / ruins / cathedrals / chapels (humans-built bias)
 * - NO firefly pillars / portal / mystical / ethereal (sci-fi)
 *
 * Legacy implementation preserved at paths/legacy/sacred-light.js.
 */

module.exports = {
  archetype: 'EARTHBOT_SACRED_LIGHT',
  pools: {
    subject: 'SACRED_LIGHT_SUBJECT',
    lighting: 'SACRED_LIGHT_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
