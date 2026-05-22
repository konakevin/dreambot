/**
 * EarthBot cozy-beach path — declarative axis-system (2026-05-22 v2 PIVOT).
 *
 * PIVOTED from village/architecture identity (v1, killed) to INTIMATE
 * COZY BEACH MOMENTS. Golden-hour atmosphere, soft palm shadows raked
 * across warm sand, driftwood-strewn cove, scattered shells, palm-
 * shadowed pocket cove, fallen tropical petals on sand. ATMOSPHERE IS
 * THE HERO. Mid-tight intimate framing.
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated phenomenon:
 * - subject_setting (the intimate beach pocket setting)
 * - foreground_element (cozy foreground accent — driftwood / shells / petals)
 * - water_state (calm soft tropical shore water)
 * - sky_layer (warm cozy sky — sunset / fair-weather)
 * - light_condition (golden hour DOMINANT)
 * - phenomenon (30%-gated — soft cozy optical event)
 *
 * All bespoke pools.
 *
 * Trigger-purge baked in:
 * - NO humans / footprints / sandcastles / implied-human-presence
 * - NO architecture / cottages / villages (v1 identity killed)
 * - NO boats / docks / piers / lounge chairs / umbrellas / bonfires
 * - NO bioluminescent / phosphorescent / sci-fi
 * - NO dramatic surf / storms (cozy is gentle warm always)
 *
 * Legacy implementation preserved at paths/legacy/cozy-beach.js.
 */

module.exports = {
  archetype: 'EARTHBOT_COZY_BEACH',
  pools: {
    subject_setting: 'COZY_BEACH_SUBJECT_SETTING',
    foreground_element: 'COZY_BEACH_FOREGROUND_ELEMENT',
    water_state: 'COZY_BEACH_WATER_STATE',
    sky_layer: 'COZY_BEACH_SKY_LAYER',
    light_condition: 'COZY_BEACH_LIGHT_CONDITION',
    phenomenon: 'COZY_BEACH_PHENOMENON',
  },
};
