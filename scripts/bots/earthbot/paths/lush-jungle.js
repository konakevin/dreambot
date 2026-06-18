/**
 * EarthBot lush-jungle path — declarative axis-system (2026-05-20 migration).
 *
 * Fourth path migrated. Same clone pattern — reuses EARTHBOT_EPIC_VISTA
 * archetype + template + 5 of epic-vista's production pools. Bespoke
 * subject pool ONLY: LUSH_JUNGLE_SUBJECT (30 MVP entries of tropical
 * rainforest interiors — buttress-root cathedrals, vine curtains, multi-tier
 * waterfall basins, dipterocarp emergents, biome-tagged, no tourist names).
 *
 * Identity: tropical rainforest at maximum visual density. Sister path
 * to deep-forest (temperate). South American lowland / Southeast Asian
 * dipterocarp / Central American cloud / Polynesian volcanic-jungle.
 *
 * Legacy implementation preserved at paths/legacy/lush-jungle.js.
 */

module.exports = {
  // 2026-06-18 — moved off EARTHBOT_EPIC_VISTA onto the INTERIOR archetype
  // (rainforest understory framed from INSIDE, filtered canopy light + humid
  // haze + vine/buttress detail, not a wide-vista overlook). Subject unchanged.
  archetype: 'EARTHBOT_FOREST_INTERIOR',
  pools: {
    subject: 'LUSH_JUNGLE_SUBJECT', // BESPOKE — tropical rainforest, biome-tagged
    lighting: 'FOREST_INTERIOR_LIGHTING',
    atmosphere: 'FOREST_INTERIOR_ATMOSPHERE',
    understory: 'FOREST_INTERIOR_UNDERSTORY',
    phenomenon: 'FOREST_INTERIOR_PHENOMENON', // 30%-gated
  },
};
