/**
 * EarthBot storm-earth — severe-weather spectacle (Stage E3). Supercell
 * mesocyclones, shelf clouds, mammatus fields, roll clouds, lightning barrages,
 * haboobs — the storm STRUCTURE as the hero, towering over EMPTY wilderness.
 * EPIC_VISTA clone with a bespoke storm subject + a bespoke storm-only sky_layer
 * (so the injected sky never rolls clear against a storm scene); lighting /
 * atmosphere / hero_feature / phenomenon reuse the shared EPIC_VISTA pools.
 * CLOUD-VOCABULARY LAW: real meteorology only, never disc/saucer/metallic/hovering.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'STORM_EARTH_SUBJECT',
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'STORM_EARTH_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
