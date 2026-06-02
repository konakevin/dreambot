/**
 * OceanBot ghost-ship — axis-system declarative path (Phase 1 stub).
 * Derelict age-of-sail vessel, fog, decay. Painterly (canvas) heritage.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_GHOST_SHIP',
  pools: {
    ship_class: 'GHOST_SHIP_SHIP_CLASS',
    decay_state: 'GHOST_SHIP_DECAY_STATE',
    fog_layer: 'GHOST_SHIP_FOG_LAYER',
    sea_state: 'GHOST_SHIP_SEA_STATE',
    light_signature: 'GHOST_SHIP_LIGHT_SIGNATURE',
    ghostly_phenomenon: 'GHOST_SHIP_GHOSTLY_PHENOMENON',
    foreground_element: 'GHOST_SHIP_FOREGROUND_ELEMENT',
    scale_provers: 'GHOST_SHIP_SCALE_PROVERS',
    camera_framing: 'GHOST_SHIP_CAMERA_FRAMING',
    surprise_element: 'GHOST_SHIP_SURPRISE_ELEMENT',
    drama: 'GHOST_SHIP_DRAMA',
  },
};
