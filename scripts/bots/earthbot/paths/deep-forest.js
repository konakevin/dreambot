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

// 2026-06-18 — moved off EARTHBOT_EPIC_VISTA (wide-vista overlook template + sky
// pools made the cathedral interior render as a sweeping postcard) onto the
// INTERIOR archetype: filtered canopy light, mist between trunks, understory
// richness, framed from INSIDE the forest. Bespoke subject pool unchanged.
module.exports = {
  archetype: 'EARTHBOT_FOREST_INTERIOR',
  pools: {
    subject: 'DEEP_FOREST_SUBJECT', // BESPOKE — temperate-forest cathedrals, biome-tagged
    lighting: 'FOREST_INTERIOR_LIGHTING',
    atmosphere: 'FOREST_INTERIOR_ATMOSPHERE',
    understory: 'FOREST_INTERIOR_UNDERSTORY',
    phenomenon: 'FOREST_INTERIOR_PHENOMENON', // 30%-gated
  },
};
