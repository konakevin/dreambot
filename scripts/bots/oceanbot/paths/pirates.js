/**
 * OceanBot pirates — axis-system declarative path (Phase 1 stub).
 * Age-of-sail piracy. Galleons, broadsides, treasure, crew on deck.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_PIRATES',
  pools: {
    vessel_class: 'PIRATES_VESSEL_CLASS',
    action_moment: 'PIRATES_ACTION_MOMENT',
    weather_state: 'PIRATES_WEATHER_STATE',
    sea_state: 'PIRATES_SEA_STATE',
    era_detail: 'PIRATES_ERA_DETAIL',
    scale_provers: 'PIRATES_SCALE_PROVERS',
    light_signature: 'PIRATES_LIGHT_SIGNATURE',
    foreground_element: 'PIRATES_FOREGROUND_ELEMENT',
    camera_framing: 'PIRATES_CAMERA_FRAMING',
    surprise_element: 'PIRATES_SURPRISE_ELEMENT',
    drama: 'PIRATES_DRAMA',
  },
};
