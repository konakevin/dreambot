/**
 * EarthBot wetlands-wild path — NEW (2026-06-18).
 *
 * Wild INLAND freshwater wetlands as the hero: deltas, swamps, lily lagoons,
 * mangrove channels, flooded forests (Okavango, Pantanal, Everglades, cypress
 * bayou, Amazon várzea, lotus lagoon). Adds a lush water-biome WITHOUT adding
 * coast. Reuses EARTHBOT_EPIC_VISTA archetype + template + shared EPIC_VISTA
 * modifier pools (clone pattern); bespoke subject pool only. No humans/built/sci-fi,
 * no ocean/sea (inland freshwater only — enforced in the gen recipe).
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'WETLANDS_WILD_SUBJECT', // BESPOKE
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
