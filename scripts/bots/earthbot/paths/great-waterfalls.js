/**
 * EarthBot great-waterfalls path — NEW (2026-06-18).
 *
 * The world's iconic waterfalls as the hero (Iguazú, Victoria, Angel, Plitvice,
 * Skógafoss, Kaieteur, Detian) at full power — scale + falling-water motion are
 * the wow. Reuses EARTHBOT_EPIC_VISTA archetype + template + shared EPIC_VISTA
 * modifier pools (clone pattern); bespoke subject pool only. No humans/built/sci-fi.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'GREAT_WATERFALLS_SUBJECT', // BESPOKE
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
