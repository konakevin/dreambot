/**
 * EarthBot national-parks path — declarative axis-system (2026-05-20 migration).
 *
 * Second path migrated to the axis system. Validates that the EARTHBOT_EPIC_VISTA
 * archetype + template are reusable across landscape paths — only the subject
 * pool needs bespoke authoring; the other 5 axes (lighting, atmosphere,
 * hero_feature, sky_layer, phenomenon) reuse epic-vista's production pools.
 *
 * Identity: US National Parks amplified to jaw-dropping gallery-tier. Same
 * "real-Earth larger-than-life" + scene-as-hero + Marc-Adamus-caliber drama
 * bar as epic-vista, scoped to iconic US Park vantages (Yosemite Tunnel View,
 * Bryce Amphitheater, Grand Prismatic, Delicate Arch, Watchman, Mt Rainier
 * at Paradise, Crater Lake, Hoh Rainforest, etc).
 *
 * REUSES EARTHBOT_EPIC_VISTA archetype + template (axis-clean lighting/atmosphere/
 * sky/phenomenon serve all real-Earth landscape paths uniformly). If national-parks
 * later needs a divergent template variation, clone the archetype then.
 *
 * Legacy implementation preserved at paths/legacy/national-parks.js for reference.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'NATIONAL_PARKS_SUBJECT', // BESPOKE — US Park vantages, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
