/**
 * EarthBot epic-vista path — declarative axis-system (2026-05-20 migration).
 *
 * Wide panoramic real-Earth landscape at maximum jaw-dropping beauty.
 * Larger than life, never AI-fake. Identity-corrected from legacy
 * "stack 3+ phenomena per frame" mandate — composition discipline now
 * mandates ONE hero subject + ONE scale-anchor + supporting clean
 * light/atmosphere/sky.
 *
 * Axes (6 total):
 *   Path-bespoke always-on: subject, lighting, atmosphere, hero_feature, sky_layer
 *   Conditional 30% gate via composer: phenomenon
 *
 * No universal axes — every axis is path-bespoke for maximum scene-aesthetic
 * tuning. No two-pass polish (setting-as-hero). No chaos perception-distortion.
 *
 * Legacy implementation preserved at paths/legacy/epic-vista.js for reference.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'EPIC_VISTA_SUBJECT',
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    // R2 (2026-05-20): foreground_anchor axis DROPPED. The always-on
    // foreground prop competed with the wow-factor subject rather than
    // supporting it (Mitre Peak + conch shells failure mode). Pivoted to
    // SCENE-AS-HERO composition — subject dominates the frame. The
    // foreground pool + composer matchTagsFromSlot infrastructure are
    // preserved for potential future scene-paths that want them.
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
