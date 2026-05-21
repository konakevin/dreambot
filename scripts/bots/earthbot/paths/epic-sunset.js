/**
 * EarthBot epic-sunset path — declarative axis-system (2026-05-20).
 *
 * Seventh path migrated. SUNSET-AS-SUBJECT — sky fills 60-70% of frame,
 * geology is silhouette/anchor only. Different register from the other
 * landscape paths (which have geology as the show).
 *
 * Reuses EARTHBOT_EPIC_VISTA archetype + 5 of epic-vista's production
 * pools. The shared lighting pool has ~70% sunset-compatible entries +
 * ~30% non-sunset (midnight sun / midday / pre-dawn). The bespoke subject
 * pool LOCKS the sunset moment strongly so Sonnet reinterprets conflicting
 * lighting axis content. If R0 shows lighting-time conflicts, R1 candidate
 * is bespoke epic_sunset_lighting pool (sunset stages only).
 *
 * Legacy implementation preserved at paths/legacy/epic-sunset.js.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'EPIC_SUNSET_SUBJECT', // BESPOKE — sunset compositions, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
