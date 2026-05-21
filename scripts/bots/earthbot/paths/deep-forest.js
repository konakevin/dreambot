/**
 * EarthBot deep-forest path — declarative axis-system (2026-05-20 migration).
 *
 * Third path migrated. Same clone pattern as national-parks — reuses
 * EARTHBOT_EPIC_VISTA archetype + template + 5 of epic-vista's production
 * pools. Only the subject pool is bespoke (DEEP_FOREST_SUBJECT — 30 MVP
 * entries of POV-led drama-led old-growth temperate forest cathedrals,
 * biome-tagged, no tourist names per playbook lesson 7).
 *
 * Identity: cathedral old-growth temperate forest — PNW Doug fir / Sitka
 * spruce / Western red cedar / Sequoia / Sierra red fir / Bavarian beech /
 * Japanese cedar / Patagonian Lenga. The "real-life LOTR cathedral
 * forest" feeling. Tropical jungle stays in lush-jungle path.
 *
 * Legacy implementation preserved at paths/legacy/deep-forest.js.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'DEEP_FOREST_SUBJECT', // BESPOKE — temperate-forest cathedrals, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
