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
  'crazy-islands',
  'girly',
  // 'lego-masters', // DEACTIVATED 2026-05-27 — narrow theme caps its pools at 10-40;
  //                    parked pending a recipe rethink. Re-enable by uncommenting
  //                    (path file + pools + recipes are intact).
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
  'lego-landscapes',
  // Stage B — promoted to live rotation 2026-08-16 (scaled to production;
  // faithful xerox of the approved shadow renders). Axis-system paths → also in
  // SKIP_LEGACY_PER_PATH below + chaos.skipPaths (chaos was off in shadow).
  'lego-city',
  'lego-trains',
  'haunted-brick',
];

const toFile = (p) => p.replace(/-/g, '_');

const PER_PATH = {};
// Paths whose pools live entirely under top-level UPPER_SNAKE pools below
// (no legacy {path}_scenes / _lighting / _palette JSONs). These newer paths
// build their briefs from bespoke axis pools, not the legacy triplet.
const SKIP_LEGACY_PER_PATH = new Set([
  'lego-landscapes',
  'lego-city',
  'lego-trains',
  'haunted-brick',
]);
for (const p of PATHS) {
  if (SKIP_LEGACY_PER_PATH.has(p)) continue;
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

// ── crazy-islands: fun/crazy tropical-island SCENE path (2026-05-27) ──
// Forked from favorite-towns (town genres dropped). One rich island_scene hero
// pool (varied fun/crazy + ~35% serene, each a readable single-hero scene) +
// lean secret-sauce axes. No tag-filtering — single theme.

const AXIS_POOLS = {
  // crazy-islands path — fun/crazy tropical-island SCENE path (2026-05-27).
  // One varied island_scene hero pool + lean secret-sauce axes (no tag-filter).
  BRICKBOT_CRAZY_ISLANDS_SCENE: load('brickbot_islands_scene'),
  BRICKBOT_CRAZY_ISLANDS_CAMERA_FRAMING: load('brickbot_islands_camera'),
  BRICKBOT_CRAZY_ISLANDS_TIME_OF_DAY: load('brickbot_islands_time'),
  BRICKBOT_CRAZY_ISLANDS_LIFE_DENSITY: load('brickbot_islands_life'),
  BRICKBOT_CRAZY_ISLANDS_SHORELINE_EDGE: load('brickbot_islands_edge'),
  BRICKBOT_CRAZY_ISLANDS_PALETTE: load('brickbot_islands_palette'),

  // lego-masters path — thirteenth BrickBot axis migration (2026-05-27)
  BRICKBOT_LEGO_MASTERS_NARRATIVE_CONCEPT: load('brickbot_lego_masters_narrative_concept'),
  BRICKBOT_LEGO_MASTERS_DRAMATIC_BEAT: load('brickbot_lego_masters_dramatic_beat'),
  BRICKBOT_LEGO_MASTERS_BUILD_TECHNIQUE: load('brickbot_lego_masters_build_technique'),
  BRICKBOT_LEGO_MASTERS_CAMERA_FRAMING: load('brickbot_lego_masters_camera_framing'),
  BRICKBOT_LEGO_MASTERS_CENTERPIECE_SUBJECT: load('brickbot_lego_masters_centerpiece_subject'),
  BRICKBOT_LEGO_MASTERS_STORY_FIGURES: load('brickbot_lego_masters_story_figures'),
  BRICKBOT_LEGO_MASTERS_LIGHTING: load('brickbot_lego_masters_lighting'),
  BRICKBOT_LEGO_MASTERS_PALETTE: load('brickbot_lego_masters_palette'),
  BRICKBOT_LEGO_MASTERS_DRAMATIC_EFFECT: load('brickbot_lego_masters_dramatic_effect'),

  // girly path — twelfth BrickBot axis migration (2026-05-27)
  BRICKBOT_GIRLY_SCENE_TYPE: load('brickbot_girly_scene_type'),
  BRICKBOT_GIRLY_MINIFIG_ACTION: load('brickbot_girly_minifig_action'),
  BRICKBOT_GIRLY_BUILD_TECHNIQUE: load('brickbot_girly_build_technique'),
  BRICKBOT_GIRLY_CAMERA_FRAMING: load('brickbot_girly_camera_framing'),
  BRICKBOT_GIRLY_SUBJECT_FOCUS: load('brickbot_girly_subject_focus'),
  BRICKBOT_GIRLY_REGISTER: load('brickbot_girly_register'),
  BRICKBOT_GIRLY_SCENE_PROPS: load('brickbot_girly_scene_props'),
  BRICKBOT_GIRLY_LIGHTING: load('brickbot_girly_lighting'),
  BRICKBOT_GIRLY_PALETTE: load('brickbot_girly_palette'),
  BRICKBOT_GIRLY_PHENOMENON: load('brickbot_girly_phenomenon'),

  // macro-display path — eleventh BrickBot axis migration (2026-05-27)
  BRICKBOT_MACRO_DISPLAY_DIORAMA_THEME: load('brickbot_macro_display_diorama_theme'),
  BRICKBOT_MACRO_DISPLAY_BUILD_SCOPE: load('brickbot_macro_display_build_scope'),
  BRICKBOT_MACRO_DISPLAY_SIGNATURE_CENTERPIECE: load(
    'brickbot_macro_display_signature_centerpiece'
  ),
  BRICKBOT_MACRO_DISPLAY_CAMERA_FRAMING: load('brickbot_macro_display_camera_framing'),
  BRICKBOT_MACRO_DISPLAY_LIFE_DENSITY: load('brickbot_macro_display_life_density'),
  BRICKBOT_MACRO_DISPLAY_BASEPLATE_EDGE: load('brickbot_macro_display_baseplate_edge'),
  BRICKBOT_MACRO_DISPLAY_LIGHTING: load('brickbot_macro_display_lighting'),
  BRICKBOT_MACRO_DISPLAY_PALETTE: load('brickbot_macro_display_palette'),
  BRICKBOT_MACRO_DISPLAY_SURPRISE_EASTER_EGG: load('brickbot_macro_display_surprise_easter_egg'),

  // mech path — tenth BrickBot axis migration (2026-05-27)
  BRICKBOT_MECH_MECH_CLASS: load('brickbot_mech_mech_class'),
  BRICKBOT_MECH_MECH_ACTION: load('brickbot_mech_mech_action'),
  BRICKBOT_MECH_BUILD_TECHNIQUE: load('brickbot_mech_build_technique'),
  BRICKBOT_MECH_CAMERA_FRAMING: load('brickbot_mech_camera_framing'),
  BRICKBOT_MECH_SETTING: load('brickbot_mech_setting'),
  BRICKBOT_MECH_REGISTER: load('brickbot_mech_register'),
  BRICKBOT_MECH_SCENE_PROPS: load('brickbot_mech_scene_props'),
  BRICKBOT_MECH_LIGHTING: load('brickbot_mech_lighting'),
  BRICKBOT_MECH_PALETTE: load('brickbot_mech_palette'),
  BRICKBOT_MECH_PHENOMENON: load('brickbot_mech_phenomenon'),

  // western path — ninth BrickBot axis migration (2026-05-27)
  BRICKBOT_WESTERN_SCENE_TYPE: load('brickbot_western_scene_type'),
  BRICKBOT_WESTERN_MINIFIG_ACTION: load('brickbot_western_minifig_action'),
  BRICKBOT_WESTERN_BUILD_TECHNIQUE: load('brickbot_western_build_technique'),
  BRICKBOT_WESTERN_CAMERA_FRAMING: load('brickbot_western_camera_framing'),
  BRICKBOT_WESTERN_SUBJECT_FOCUS: load('brickbot_western_subject_focus'),
  BRICKBOT_WESTERN_REGISTER: load('brickbot_western_register'),
  BRICKBOT_WESTERN_SCENE_PROPS: load('brickbot_western_scene_props'),
  BRICKBOT_WESTERN_LIGHTING: load('brickbot_western_lighting'),
  BRICKBOT_WESTERN_PALETTE: load('brickbot_western_palette'),
  BRICKBOT_WESTERN_PHENOMENON: load('brickbot_western_phenomenon'),

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

  // lego-city (Stage B1, SHADOW) — modern LEGO City life
  BRICKBOT_LEGO_CITY_SCENE_TYPE: load('brickbot_lego_city_scene_type'),
  BRICKBOT_LEGO_CITY_MINIFIG_ACTION: load('brickbot_lego_city_minifig_action'),
  BRICKBOT_LEGO_CITY_BUILD_TECHNIQUE: load('brickbot_lego_city_build_technique'),
  BRICKBOT_LEGO_CITY_CAMERA_FRAMING: load('brickbot_lego_city_camera_framing'),
  BRICKBOT_LEGO_CITY_VEHICLE_CLASS: load('brickbot_lego_city_vehicle_class'),
  BRICKBOT_LEGO_CITY_REGISTER: load('brickbot_lego_city_register'),
  BRICKBOT_LEGO_CITY_SCENE_PROPS: load('brickbot_lego_city_scene_props'),
  BRICKBOT_LEGO_CITY_LIGHTING: load('brickbot_lego_city_lighting'),
  BRICKBOT_LEGO_CITY_PALETTE: load('brickbot_lego_city_palette'),
  BRICKBOT_LEGO_CITY_CITY_EVENT: load('brickbot_lego_city_city_event'),

  // lego-trains (Stage B2, SHADOW) — LEGO trains through all-brick worlds
  BRICKBOT_LEGO_TRAINS_TRAIN_CONSIST: load('brickbot_lego_trains_train_consist'),
  BRICKBOT_LEGO_TRAINS_TRACKWORK: load('brickbot_lego_trains_trackwork'),
  BRICKBOT_LEGO_TRAINS_ROUTE_BIOME: load('brickbot_lego_trains_route_biome'),
  BRICKBOT_LEGO_TRAINS_STATION_LIFE: load('brickbot_lego_trains_station_life'),
  BRICKBOT_LEGO_TRAINS_CAMERA_FRAMING: load('brickbot_lego_trains_camera_framing'),
  BRICKBOT_LEGO_TRAINS_BUILD_TECHNIQUE: load('brickbot_lego_trains_build_technique'),
  BRICKBOT_LEGO_TRAINS_LIGHTING: load('brickbot_lego_trains_lighting'),
  BRICKBOT_LEGO_TRAINS_PALETTE: load('brickbot_lego_trains_palette'),
  BRICKBOT_LEGO_TRAINS_RAIL_EVENT: load('brickbot_lego_trains_rail_event'),

  // haunted-brick (Stage B3, SHADOW) — LEGO Creator Haunted-House spooky-fun
  BRICKBOT_HAUNTED_BRICK_SCENE_TYPE: load('brickbot_haunted_brick_scene_type'),
  BRICKBOT_HAUNTED_BRICK_MINIFIG_ACTION: load('brickbot_haunted_brick_minifig_action'),
  BRICKBOT_HAUNTED_BRICK_BUILD_TECHNIQUE: load('brickbot_haunted_brick_build_technique'),
  BRICKBOT_HAUNTED_BRICK_CAMERA_FRAMING: load('brickbot_haunted_brick_camera_framing'),
  BRICKBOT_HAUNTED_BRICK_SUBJECT_FOCUS: load('brickbot_haunted_brick_subject_focus'),
  BRICKBOT_HAUNTED_BRICK_REGISTER: load('brickbot_haunted_brick_register'),
  BRICKBOT_HAUNTED_BRICK_SCENE_PROPS: load('brickbot_haunted_brick_scene_props'),
  BRICKBOT_HAUNTED_BRICK_LIGHTING: load('brickbot_haunted_brick_lighting'),
  BRICKBOT_HAUNTED_BRICK_PALETTE: load('brickbot_haunted_brick_palette'),
  BRICKBOT_HAUNTED_BRICK_APPARITION: load('brickbot_haunted_brick_apparition'),

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

  // lego-landscapes path (2026-06-06) — real-world wide vistas as LEGO
  // landscape dioramas. Pool is extracted from location_iconic_spots
  // (wide + pure_scene_eligible). Re-extract by running
  // scripts/bots/brickbot/seeds/extract-lego-landscapes-locations.js.
  // Entries are { location, scene } objects.
  BRICKBOT_LEGO_LANDSCAPES_LOCATIONS: load('brickbot_lego_landscapes_locations'),
};

module.exports = {
  CAMERA_AXIS: load('camera_axis'),
  PER_PATH,
  PATHS,
  ...AXIS_POOLS,
};
