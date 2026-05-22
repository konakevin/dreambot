/**
 * EarthBot waves path — declarative axis-system (2026-05-22).
 *
 * MERGES legacy wave + big-wave paths into one path. Two registers
 * coexist in the subject pool:
 *   - Intimate Clark-Little-style barrel + spray + translucent tube
 *   - Monumental big-wave breaking on reefs / cliffs / points
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated phenomenon:
 * - wave_subject (THE hero — intimate barrel OR monumental wall)
 * - coastal_context (what the wave breaks ON: reef / cliff / point)
 * - water_color (color quality of the wave water)
 * - sky_layer (sky behavior above the wave)
 * - light_condition (golden hour / storm-break / sunset / dawn)
 * - phenomenon (30%-gated — rainbow / spray-prism / sun-pillar)
 *
 * All bespoke pools — waves have unique water-physics and Clark-Little
 * compositional register.
 *
 * Trigger-purge baked in from R0:
 * - NO surfers / boards / fins / wetsuits / humans
 * - NO named breaks (no Pipeline / Teahupoʻo / Jaws Maui / Mavericks)
 * - NO architecture / piers / lighthouses
 * - NO bioluminescent / phosphorescent / sci-fi water
 * - NO impossible-physics flat-sand walls / tsunamis
 * - NO single-beam / single-shaft (laser trigger)
 *
 * Legacy implementations preserved at:
 *   paths/legacy/wave.js (Clark-Little intimate-barrel pools)
 *   paths/legacy/big-wave.js (monumental big-wave pools)
 */

module.exports = {
  archetype: 'EARTHBOT_WAVES',
  pools: {
    wave_subject: 'WAVES_SUBJECT',
    composition: 'WAVES_COMPOSITION',
    coastal_context: 'WAVES_COASTAL_CONTEXT',
    water_color: 'WAVES_WATER_COLOR',
    sky_layer: 'WAVES_SKY_LAYER',
    light_condition: 'WAVES_LIGHT_CONDITION',
    phenomenon: 'WAVES_PHENOMENON',
  },
};
