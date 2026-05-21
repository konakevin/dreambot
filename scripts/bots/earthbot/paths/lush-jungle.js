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
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'LUSH_JUNGLE_SUBJECT', // BESPOKE — tropical rainforest, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
