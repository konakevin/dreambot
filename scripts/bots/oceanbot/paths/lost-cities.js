/**
 * OceanBot lost-cities — axis-system declarative path.
 *
 * Sister to shipwreck-kingdom: same underwater register, but the hero
 * is HEWN STONE (drowned civilizational architecture) instead of
 * pre-1850 WOODEN ship. Atlantis-style ruins, drowned temples, coral-
 * grown statues of forgotten gods, toppled colossi, ziggurats half-
 * buried in coral.
 *
 * Wires the OCEANBOT_LOST_CITIES archetype slots to per-axis pool names
 * that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 * Full-bespoke pools per [[feedback_full_bespoke_per_path_no_shared_pools]]
 * — no pool reuse from shipwreck-kingdom even where the axis name
 * matches (coral on stone columns ≠ coral on wooden ribs).
 *
 * LEAN 5-axis output (cut from 10 + drama → 5 on 2026-06-04). Dropped
 * pool mappings (crumble_state / water_clarity / foreground_element /
 * scale_provers / surprise_element / drama) are unreferenced here so
 * the composer doesn't request them, but the corresponding seed JSON
 * files + the LOST_CITIES_* pool registrations in pools.js are still
 * on disk → easy to re-enable by restoring the mappings. See
 * archetypes.js header for the full diagnosis behind the cut.
 */

module.exports = {
  archetype: 'OCEANBOT_LOST_CITIES',
  pools: {
    ruin_class: 'LOST_CITIES_RUIN_CLASS',
    coral_growth: 'LOST_CITIES_CORAL_GROWTH',
    marine_life: 'LOST_CITIES_MARINE_LIFE',
    caustic_light: 'LOST_CITIES_CAUSTIC_LIGHT',
    camera_framing: 'LOST_CITIES_CAMERA_FRAMING',
  },
};
