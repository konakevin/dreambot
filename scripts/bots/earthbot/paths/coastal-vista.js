/**
 * EarthBot coastal-vista path — declarative axis-system (2026-05-20 migration).
 *
 * Fifth path migrated. FIRST BEACH-SIDE PATH — validates the canonical
 * landscape template clones cross-namespace (Earth + Beach paths share
 * paths/ flat dir and use the same archetype).
 *
 * Identity: DRAMATIC craggy coast — Icelandic basalt / PNW stack coast /
 * Norwegian fjord / Irish chalk-Atlantic / Big Sur cliff / Hawaiian
 * volcanic sea cliff / Australian Southern Ocean stack. The "I can't
 * believe this is Earth" coastal-geology. NOT tropical paradise (that's
 * a separate path).
 *
 * Reuses EARTHBOT_EPIC_VISTA archetype + 5 of epic-vista's production
 * pools. Bespoke subject pool ONLY: COASTAL_VISTA_SUBJECT (30 MVP
 * entries, biome-tagged, drama-led, POV-led, no tourist names per
 * LESSON 7, no human-built features per LESSON 8).
 *
 * Legacy implementation preserved at paths/legacy/coastal-vista.js.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'COASTAL_VISTA_SUBJECT', // BESPOKE — dramatic craggy coast, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
