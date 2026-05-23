/**
 * BrickBot pools — shared camera-axis + per-path triplets (scenes, lighting,
 * palette).
 *
 * 13 paths × 3 pools each = 39 path-specific JSON pools, plus 1 shared
 * camera_axis pool. Flat naming: {path}_{kind}.json.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Kebab-case path identifiers (used in code + captions).
// Pool filenames convert to snake_case via toFile().
const PATHS = [
  'macro-display',
  'girly',
  'lego-masters',
  'western',
  'fantasy',
  'space',
  'aquatic',
  'winter',
  'pirates',
  'mech',
  'theme-park',
  'forest',
  'landscape',
];

const toFile = (p) => p.replace(/-/g, '_');

const PER_PATH = {};
for (const p of PATHS) {
  const f = toFile(p);
  PER_PATH[p] = {
    scenes: load(`${f}_scenes`),
    lighting: load(`${f}_lighting`),
    palette: load(`${f}_palette`),
  };
}

// ─────────────────────────────────────────────────────────────
// Axis-system pools — bespoke per migrated path (2026-05-22 onward).
// Each migrated path owns `brickbot_<path>_<axis>.json` seed files.
// Top-level pool names are UPPER_SNAKE_CASE and resolved via
// `bot.poolByName(name)` from the brief-composer.
// ─────────────────────────────────────────────────────────────

const AXIS_POOLS = {
  // fantasy path — third BrickBot axis migration (2026-05-22)
  BRICKBOT_FANTASY_SCENE_TYPE: load('brickbot_fantasy_scene_type'),
  BRICKBOT_FANTASY_MINIFIG_ACTION: load('brickbot_fantasy_minifig_action'),
  BRICKBOT_FANTASY_BUILD_TECHNIQUE: load('brickbot_fantasy_build_technique'),
  BRICKBOT_FANTASY_CAMERA_FRAMING: load('brickbot_fantasy_camera_framing'),
  BRICKBOT_FANTASY_SUBJECT_FOCUS: load('brickbot_fantasy_subject_focus'),
  BRICKBOT_FANTASY_REGISTER: load('brickbot_fantasy_register'),
  BRICKBOT_FANTASY_SCENE_PROPS: load('brickbot_fantasy_scene_props'),
  BRICKBOT_FANTASY_LIGHTING: load('brickbot_fantasy_lighting'),
  BRICKBOT_FANTASY_PALETTE: load('brickbot_fantasy_palette'),
  BRICKBOT_FANTASY_MAGICAL_PHENOMENON: load('brickbot_fantasy_magical_phenomenon'),

  // space path — second BrickBot axis migration (2026-05-22)
  BRICKBOT_SPACE_SCENE_TYPE: load('brickbot_space_scene_type'),
  BRICKBOT_SPACE_MINIFIG_ACTION: load('brickbot_space_minifig_action'),
  BRICKBOT_SPACE_BUILD_TECHNIQUE: load('brickbot_space_build_technique'),
  BRICKBOT_SPACE_CAMERA_FRAMING: load('brickbot_space_camera_framing'),
  BRICKBOT_SPACE_VEHICLE_CLASS: load('brickbot_space_vehicle_class'),
  BRICKBOT_SPACE_REGISTER: load('brickbot_space_register'),
  BRICKBOT_SPACE_SCENE_PROPS: load('brickbot_space_scene_props'),
  BRICKBOT_SPACE_LIGHTING: load('brickbot_space_lighting'),
  BRICKBOT_SPACE_PALETTE: load('brickbot_space_palette'),
  BRICKBOT_SPACE_COSMIC_PHENOMENON: load('brickbot_space_cosmic_phenomenon'),

  // pirates path — first BrickBot axis migration (2026-05-22)
  BRICKBOT_PIRATES_SCENE_TYPE: load('brickbot_pirates_scene_type'),
  BRICKBOT_PIRATES_MINIFIG_ACTION: load('brickbot_pirates_minifig_action'),
  BRICKBOT_PIRATES_BUILD_TECHNIQUE: load('brickbot_pirates_build_technique'),
  BRICKBOT_PIRATES_CAMERA_FRAMING: load('brickbot_pirates_camera_framing'),
  BRICKBOT_PIRATES_SHIP_CLASS: load('brickbot_pirates_ship_class'),
  BRICKBOT_PIRATES_REGISTER: load('brickbot_pirates_register'),
  BRICKBOT_PIRATES_SCENE_PROPS: load('brickbot_pirates_scene_props'),
  BRICKBOT_PIRATES_LIGHTING: load('brickbot_pirates_lighting'),
  BRICKBOT_PIRATES_PALETTE: load('brickbot_pirates_palette'),
  BRICKBOT_PIRATES_WEATHER_DRAMA: load('brickbot_pirates_weather_drama'),
};

module.exports = {
  CAMERA_AXIS: load('camera_axis'),
  PER_PATH,
  PATHS,
  ...AXIS_POOLS,
};
