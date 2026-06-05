/**
 * OceanBot shipwreck-kingdom — axis-system declarative path.
 *
 * Wires the OCEANBOT_SHIPWRECK_KINGDOM archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_SHIPWRECK_KINGDOM',
  pools: {
    wreck_class: 'SHIPWRECK_KINGDOM_WRECK_CLASS',
    decay_state: 'SHIPWRECK_KINGDOM_DECAY_STATE',
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
