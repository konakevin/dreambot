/**
 * OceanBot lost-cities — axis-system declarative path (Phase 1 stub).
 * Atlantis-coded sunken civilization.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_LOST_CITIES',
  pools: {
    architectural_anchor: 'LOST_CITIES_ARCHITECTURAL_ANCHOR',
    civilization_motif: 'LOST_CITIES_CIVILIZATION_MOTIF',
    reclamation_state: 'LOST_CITIES_RECLAMATION_STATE',
    marine_life: 'LOST_CITIES_MARINE_LIFE',
    caustic_light: 'LOST_CITIES_CAUSTIC_LIGHT',
    water_clarity: 'LOST_CITIES_WATER_CLARITY',
    foreground_element: 'LOST_CITIES_FOREGROUND_ELEMENT',
    scale_provers: 'LOST_CITIES_SCALE_PROVERS',
    camera_framing: 'LOST_CITIES_CAMERA_FRAMING',
    surprise_element: 'LOST_CITIES_SURPRISE_ELEMENT',
    drama: 'LOST_CITIES_DRAMA',
  },
};
