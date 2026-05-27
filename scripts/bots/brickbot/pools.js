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
  // theme-park path — eighth BrickBot axis migration (2026-05-27)
  BRICKBOT_THEME_PARK_ATTRACTION: load('brickbot_theme_park_attraction'),
  BRICKBOT_THEME_PARK_CROWD_ACTION: load('brickbot_theme_park_crowd_action'),
  BRICKBOT_THEME_PARK_BUILD_TECHNIQUE: load('brickbot_theme_park_build_technique'),
  BRICKBOT_THEME_PARK_CAMERA_FRAMING: load('brickbot_theme_park_camera_framing'),
  BRICKBOT_THEME_PARK_REGISTER: load('brickbot_theme_park_register'),
  BRICKBOT_THEME_PARK_SCENE_LIFE: load('brickbot_theme_park_scene_life'),
  BRICKBOT_THEME_PARK_LIGHTING: load('brickbot_theme_park_lighting'),
  BRICKBOT_THEME_PARK_PALETTE: load('brickbot_theme_park_palette'),
  BRICKBOT_THEME_PARK_SPECTACLE: load('brickbot_theme_park_spectacle'),

  // landscape path — seventh BrickBot axis migration (2026-05-27)
  BRICKBOT_LANDSCAPE_BIOME_VISTA: load('brickbot_landscape_biome_vista'),
  BRICKBOT_LANDSCAPE_TERRAIN_BUILD_TECHNIQUE: load('brickbot_landscape_terrain_build_technique'),
  BRICKBOT_LANDSCAPE_SCALE_PROVER: load('brickbot_landscape_scale_prover'),
  BRICKBOT_LANDSCAPE_FLORA_DETAIL: load('brickbot_landscape_flora_detail'),
  BRICKBOT_LANDSCAPE_CAMERA_FRAMING: load('brickbot_landscape_camera_framing'),
  BRICKBOT_LANDSCAPE_ATMOSPHERE: load('brickbot_landscape_atmosphere'),
  BRICKBOT_LANDSCAPE_LIGHTING: load('brickbot_landscape_lighting'),
  BRICKBOT_LANDSCAPE_PALETTE: load('brickbot_landscape_palette'),
  BRICKBOT_LANDSCAPE_NATURAL_PHENOMENON: load('brickbot_landscape_natural_phenomenon'),

  // aquatic path — fifth BrickBot axis migration (2026-05-27)
  BRICKBOT_AQUATIC_SCENE_TYPE: load('brickbot_aquatic_scene_type'),
  BRICKBOT_AQUATIC_MINIFIG_ACTION: load('brickbot_aquatic_minifig_action'),
  BRICKBOT_AQUATIC_WATER_BUILD_TECHNIQUE: load('brickbot_aquatic_water_build_technique'),
  BRICKBOT_AQUATIC_CAMERA_FRAMING: load('brickbot_aquatic_camera_framing'),
  BRICKBOT_AQUATIC_SUBJECT_FOCUS: load('brickbot_aquatic_subject_focus'),
  BRICKBOT_AQUATIC_REGISTER: load('brickbot_aquatic_register'),
  BRICKBOT_AQUATIC_MARINE_LIFE: load('brickbot_aquatic_marine_life'),
  BRICKBOT_AQUATIC_SCENE_PROPS: load('brickbot_aquatic_scene_props'),
  BRICKBOT_AQUATIC_LIGHTING: load('brickbot_aquatic_lighting'),
  BRICKBOT_AQUATIC_PALETTE: load('brickbot_aquatic_palette'),
  BRICKBOT_AQUATIC_PHENOMENON: load('brickbot_aquatic_phenomenon'),

  // winter path — sixth BrickBot axis migration (2026-05-27)
  BRICKBOT_WINTER_SCENE_TYPE: load('brickbot_winter_scene_type'),
  BRICKBOT_WINTER_MINIFIG_ACTION: load('brickbot_winter_minifig_action'),
  BRICKBOT_WINTER_SNOW_ICE_BUILD_TECHNIQUE: load('brickbot_winter_snow_ice_build_technique'),
  BRICKBOT_WINTER_CAMERA_FRAMING: load('brickbot_winter_camera_framing'),
  BRICKBOT_WINTER_SUBJECT_FOCUS: load('brickbot_winter_subject_focus'),
  BRICKBOT_WINTER_REGISTER: load('brickbot_winter_register'),
  BRICKBOT_WINTER_SCENE_PROPS: load('brickbot_winter_scene_props'),
  BRICKBOT_WINTER_LIGHTING: load('brickbot_winter_lighting'),
  BRICKBOT_WINTER_PALETTE: load('brickbot_winter_palette'),
  BRICKBOT_WINTER_PHENOMENON: load('brickbot_winter_phenomenon'),

  // forest path — fourth BrickBot axis migration (2026-05-27)
  BRICKBOT_FOREST_SCENE_TYPE: load('brickbot_forest_scene_type'),
  BRICKBOT_FOREST_MINIFIG_ACTION: load('brickbot_forest_minifig_action'),
  BRICKBOT_FOREST_BUILD_TECHNIQUE: load('brickbot_forest_build_technique'),
  BRICKBOT_FOREST_CAMERA_FRAMING: load('brickbot_forest_camera_framing'),
  BRICKBOT_FOREST_SUBJECT_FOCUS: load('brickbot_forest_subject_focus'),
  BRICKBOT_FOREST_REGISTER: load('brickbot_forest_register'),
  BRICKBOT_FOREST_SCENE_PROPS: load('brickbot_forest_scene_props'),
  BRICKBOT_FOREST_LIGHTING: load('brickbot_forest_lighting'),
  BRICKBOT_FOREST_PALETTE: load('brickbot_forest_palette'),
  BRICKBOT_FOREST_WOODLAND_PHENOMENON: load('brickbot_forest_woodland_phenomenon'),

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
