/**
 * EarthBot beach-night path — declarative axis-system (2026-05-21).
 *
 * Magical warm tropical beach scenes at night. NATURAL light sources
 * only (moonlight / starlight / Milky Way). The legacy beach-night
 * leaned heavily on tiki torches / lanterns / bonfires / dock posts /
 * paper lights — all stripped here as they're human-built bias triggers
 * (and Flux often paints humans nearby campfires + lanterns).
 *
 * Also stripped: bioluminescent waves / phosphorescent surf — those are
 * "real" in nature but Flux renders them as sci-fi alien-tech glow.
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated phenomenon:
 * - subject (tropical beach geographic setting, night context)
 * - light_source (THE hero — moon / stars / Milky Way variations)
 * - night_sky (sky behavior — clouds, position of moon, star density)
 * - water_state (calm reflective tropical water at night)
 * - shoreline_element (palm silhouettes / lava rocks / driftwood / sand)
 * - phenomenon (30%-gated — shooting star / moonbow / distant lightning)
 *
 * All bespoke pools — beach-night is unique enough that EPIC_VISTA /
 * REEF_PARADISE pools don't transfer (daytime vs night).
 *
 * Legacy implementation preserved at paths/legacy/beach-night.js.
 */

module.exports = {
  archetype: 'EARTHBOT_BEACH_NIGHT',
  pools: {
    subject: 'BEACH_NIGHT_SUBJECT',
    light_source: 'BEACH_NIGHT_LIGHT_SOURCE',
    night_sky: 'BEACH_NIGHT_SKY',
    water_state: 'BEACH_NIGHT_WATER_STATE',
    shoreline_element: 'BEACH_NIGHT_SHORELINE_ELEMENT',
    phenomenon: 'BEACH_NIGHT_PHENOMENON',
  },
};
