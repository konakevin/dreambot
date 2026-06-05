/**
 * OceanBot shipwreck-kingdom — axis-system declarative path.
 *
 * Wires the OCEANBOT_SHIPWRECK_KINGDOM archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 *
 * LEAN 5-axis output (cut from 10 + drama → 5 on 2026-06-04). Dropped
 * pool mappings (decay_state / water_clarity / foreground_element /
 * scale_provers / surprise_element / drama) are unreferenced here so
 * the composer doesn't request them, but the corresponding seed JSON
 * files + the SHIPWRECK_KINGDOM_* pool registrations in pools.js are
 * still on disk → easy to re-enable by restoring the mappings. See
 * archetypes.js header for the full diagnosis behind the cut.
 */

module.exports = {
  archetype: 'OCEANBOT_SHIPWRECK_KINGDOM',
  pools: {
    wreck_class: 'SHIPWRECK_KINGDOM_WRECK_CLASS',
    coral_growth: 'SHIPWRECK_KINGDOM_CORAL_GROWTH',
    marine_life: 'SHIPWRECK_KINGDOM_MARINE_LIFE',
    caustic_light: 'SHIPWRECK_KINGDOM_CAUSTIC_LIGHT',
    camera_framing: 'SHIPWRECK_KINGDOM_CAMERA_FRAMING',
  },
};
