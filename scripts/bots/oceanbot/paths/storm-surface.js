/**
 * OceanBot storm-surface — axis-system declarative path (Phase 1 stub).
 * Violent sea storms, lightning on waves, mountain-sized swells.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_STORM_SURFACE',
  pools: {
    storm_type: 'STORM_SURFACE_STORM_TYPE',
    sea_state: 'STORM_SURFACE_SEA_STATE',
    sky_signature: 'STORM_SURFACE_SKY_SIGNATURE',
    light_phenomenon: 'STORM_SURFACE_LIGHT_PHENOMENON',
    vessel_optional: 'STORM_SURFACE_VESSEL_OPTIONAL',
    foreground_element: 'STORM_SURFACE_FOREGROUND_ELEMENT',
    scale_provers: 'STORM_SURFACE_SCALE_PROVERS',
    weather_air: 'STORM_SURFACE_WEATHER_AIR',
    camera_framing: 'STORM_SURFACE_CAMERA_FRAMING',
    surprise_element: 'STORM_SURFACE_SURPRISE_ELEMENT',
    drama: 'STORM_SURFACE_DRAMA',
  },
};
