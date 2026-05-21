/**
 * EarthBot tropical-paradise path — declarative axis-system (2026-05-20).
 *
 * Sixth path migrated. Sibling to coastal-vista on beach side — both
 * coast paths now done. Different register: PARADISE coast (palms /
 * turquoise / white-sand / lagoon / atoll / reef edge) vs coastal-vista's
 * DRAMATIC craggy cliff coast.
 *
 * Reuses EARTHBOT_EPIC_VISTA archetype + 5 of epic-vista's production
 * pools. Bespoke subject pool only: TROPICAL_PARADISE_SUBJECT (30 MVP
 * entries, biome-tagged, drama-led, POV-led, NO tourist names per
 * LESSON 7, NO human-built features per LESSON 8 — strict ban on
 * overwater bungalows / thatched huts / boardwalks / beach umbrellas).
 *
 * Legacy implementation preserved at paths/legacy/tropical-paradise.js.
 */

module.exports = {
  archetype: 'EARTHBOT_EPIC_VISTA',
  pools: {
    subject: 'TROPICAL_PARADISE_SUBJECT', // BESPOKE — paradise coast, biome-tagged
    lighting: 'EPIC_VISTA_LIGHTING',
    atmosphere: 'EPIC_VISTA_ATMOSPHERE',
    hero_feature: 'EPIC_VISTA_HERO_FEATURE',
    sky_layer: 'EPIC_VISTA_SKY',
    phenomenon: 'EPIC_VISTA_PHENOMENON',
  },
};
