/**
 * OceanBot whale-encounter — axis-system declarative path (Phase 1 stub).
 * Cinematic humpback/blue/orca whale moment.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_WHALE_ENCOUNTER',
  pools: {
    whale_species: 'WHALE_ENCOUNTER_WHALE_SPECIES',
    whale_action: 'WHALE_ENCOUNTER_WHALE_ACTION',
    depth_setting: 'WHALE_ENCOUNTER_DEPTH_SETTING',
    light_signature: 'WHALE_ENCOUNTER_LIGHT_SIGNATURE',
    water_clarity: 'WHALE_ENCOUNTER_WATER_CLARITY',
    marine_supporting_life: 'WHALE_ENCOUNTER_MARINE_SUPPORTING_LIFE',
    foreground_element: 'WHALE_ENCOUNTER_FOREGROUND_ELEMENT',
    scale_provers: 'WHALE_ENCOUNTER_SCALE_PROVERS',
    camera_framing: 'WHALE_ENCOUNTER_CAMERA_FRAMING',
    surprise_element: 'WHALE_ENCOUNTER_SURPRISE_ELEMENT',
    drama: 'WHALE_ENCOUNTER_DRAMA',
  },
};
