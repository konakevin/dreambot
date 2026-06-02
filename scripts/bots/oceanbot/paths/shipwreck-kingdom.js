/**
 * OceanBot shipwreck-kingdom — axis-system declarative path (Phase 1 stub).
 * Wrecks reclaimed by marine ecosystems.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_SHIPWRECK_KINGDOM',
  pools: {
    wreck_class: 'SHIPWRECK_KINGDOM_WRECK_CLASS',
    reclamation_state: 'SHIPWRECK_KINGDOM_RECLAMATION_STATE',
    coral_growth: 'SHIPWRECK_KINGDOM_CORAL_GROWTH',
    marine_life: 'SHIPWRECK_KINGDOM_MARINE_LIFE',
    caustic_light: 'SHIPWRECK_KINGDOM_CAUSTIC_LIGHT',
    water_clarity: 'SHIPWRECK_KINGDOM_WATER_CLARITY',
    foreground_element: 'SHIPWRECK_KINGDOM_FOREGROUND_ELEMENT',
    scale_provers: 'SHIPWRECK_KINGDOM_SCALE_PROVERS',
    camera_framing: 'SHIPWRECK_KINGDOM_CAMERA_FRAMING',
    surprise_element: 'SHIPWRECK_KINGDOM_SURPRISE_ELEMENT',
    drama: 'SHIPWRECK_KINGDOM_DRAMA',
  },
};
