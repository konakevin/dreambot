/**
 * OceanBot polar-seas — axis-system declarative path (Phase 1 stub).
 * Arctic/Antarctic icy ocean, icebergs, aurora.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_POLAR_SEAS',
  pools: {
    ice_anchor: 'POLAR_SEAS_ICE_ANCHOR',
    polar_biome: 'POLAR_SEAS_POLAR_BIOME',
    polar_marine_life: 'POLAR_SEAS_POLAR_MARINE_LIFE',
    sky_phenomenon: 'POLAR_SEAS_SKY_PHENOMENON',
    water_state: 'POLAR_SEAS_WATER_STATE',
    light_signature: 'POLAR_SEAS_LIGHT_SIGNATURE',
    foreground_element: 'POLAR_SEAS_FOREGROUND_ELEMENT',
    scale_provers: 'POLAR_SEAS_SCALE_PROVERS',
    camera_framing: 'POLAR_SEAS_CAMERA_FRAMING',
    surprise_element: 'POLAR_SEAS_SURPRISE_ELEMENT',
    drama: 'POLAR_SEAS_DRAMA',
  },
};
