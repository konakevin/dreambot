/**
 * OceanBot bioluminescent-night — axis-system declarative path (Phase 1 stub).
 * Glowing plankton, neon dinoflagellates, fluorescent reef.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_BIOLUMINESCENT_NIGHT',
  pools: {
    bioluminescent_anchor: 'BIOLUMINESCENT_NIGHT_BIOLUMINESCENT_ANCHOR',
    light_pattern: 'BIOLUMINESCENT_NIGHT_LIGHT_PATTERN',
    depth_setting: 'BIOLUMINESCENT_NIGHT_DEPTH_SETTING',
    supporting_marine_life: 'BIOLUMINESCENT_NIGHT_SUPPORTING_MARINE_LIFE',
    water_state: 'BIOLUMINESCENT_NIGHT_WATER_STATE',
    foreground_element: 'BIOLUMINESCENT_NIGHT_FOREGROUND_ELEMENT',
    atmospheric_haze: 'BIOLUMINESCENT_NIGHT_ATMOSPHERIC_HAZE',
    color_signature: 'BIOLUMINESCENT_NIGHT_COLOR_SIGNATURE',
    camera_framing: 'BIOLUMINESCENT_NIGHT_CAMERA_FRAMING',
    surprise_element: 'BIOLUMINESCENT_NIGHT_SURPRISE_ELEMENT',
    drama: 'BIOLUMINESCENT_NIGHT_DRAMA',
  },
};
