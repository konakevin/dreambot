/**
 * MermaidBot — axis pools.
 *
 * Regenerate any pool:
 *     node scripts/gen-seeds/mermaidbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

module.exports = {
  // ── Shared DNA (rolled once per render) ──
  MERMAID_FEATURES: load('mermaid_features'),
  WATER_CONDITIONS: load('water_conditions'),
  SCENE_PALETTES: load('scene_palettes'),

  // ── Path-specific axis pools ──
  SIREN_SETTINGS: load('siren_settings'),
  SIREN_MOMENTS: load('siren_moments'),

  DEEP_SETTINGS: load('deep_settings'),
  DEEP_ACTIONS: load('deep_actions'),

  REEF_SETTINGS: load('reef_settings'),
  REEF_ACTIONS: load('reef_actions'),

  DARK_SETTINGS: load('dark_settings'),
  DARK_MOMENTS: load('dark_moments'),

  ROYAL_SETTINGS: load('royal_settings'),
  ROYAL_ACTIONS: load('royal_actions'),

  SHORE_SETTINGS: load('shore_settings'),
  SHORE_MOMENTS: load('shore_moments'),

  ICE_SETTINGS: load('ice_settings'),
  ICE_ACTIONS: load('ice_actions'),

  WARRIOR_SETTINGS: load('warrior_settings'),
  WARRIOR_ACTIONS: load('warrior_actions'),
};
