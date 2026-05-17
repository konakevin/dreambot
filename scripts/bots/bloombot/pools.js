/**
 * BloomBot pools — small + load-bearing.
 *
 * Two hand-authored pools (palettes + lighting) plus one Sonnet-generated
 * sensory pool. Regional flora roster lives in species-roster.js as a JS
 * module rather than JSON because it's keyed lookup, not random pick.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

function loadIfExists(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

module.exports = {
  PALETTES: load('palettes'),
  LIGHTING: load('lighting'),
  // ─── landscape path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_LANDSCAPE_LANDFORM: loadIfExists('bloombot_landscape_landform'),
  BLOOMBOT_LANDSCAPE_SCALE_PROVER: loadIfExists('bloombot_landscape_scale_prover'),
  BLOOMBOT_LANDSCAPE_SURPRISE_ELEMENT: loadIfExists('bloombot_landscape_surprise_element'),
  BLOOMBOT_LANDSCAPE_SKY: loadIfExists('bloombot_landscape_sky'),
  BLOOMBOT_LANDSCAPE_PHENOMENON: loadIfExists('bloombot_landscape_phenomenon'),
  // ─── closeup path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CLOSEUP_BLOOM_WALL_TYPE: loadIfExists('bloombot_closeup_bloom_wall_type'),
  BLOOMBOT_CLOSEUP_GROWING_CONTEXT: loadIfExists('bloombot_closeup_growing_context'),
  BLOOMBOT_CLOSEUP_MACRO_PHENOMENON: loadIfExists('bloombot_closeup_macro_phenomenon'),
  // ─── conservatory path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CONSERVATORY_CONSERVATORY_TYPE: loadIfExists('bloombot_conservatory_conservatory_type'),
  BLOOMBOT_CONSERVATORY_STRUCTURAL_ANCHOR: loadIfExists('bloombot_conservatory_structural_anchor'),
  BLOOMBOT_CONSERVATORY_ATMOSPHERIC_PHENOMENON: loadIfExists('bloombot_conservatory_atmospheric_phenomenon'),
  // ─── dreamscape path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_DREAMSCAPE_IMPOSSIBILITY_TYPE: loadIfExists('bloombot_dreamscape_impossibility_type'),
  BLOOMBOT_DREAMSCAPE_WORLD_ELEMENT: loadIfExists('bloombot_dreamscape_world_element'),
  BLOOMBOT_DREAMSCAPE_ATMOSPHERIC_HALO: loadIfExists('bloombot_dreamscape_atmospheric_halo'),
  // ─── garden-walk path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_GARDEN_WALK_ARCHWAY_TYPE: loadIfExists('bloombot_garden_walk_archway_type'),
  BLOOMBOT_GARDEN_WALK_PATH_MATERIAL: loadIfExists('bloombot_garden_walk_path_material'),
  BLOOMBOT_GARDEN_WALK_DESTINATION_GLIMPSE: loadIfExists('bloombot_garden_walk_destination_glimpse'),
  BLOOMBOT_GARDEN_WALK_ATMOSPHERIC_PHENOMENON: loadIfExists('bloombot_garden_walk_atmospheric_phenomenon'),
  // ─── cozy path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_COZY_INTERIOR_SETTING: loadIfExists('bloombot_cozy_interior_setting'),
  BLOOMBOT_COZY_FURNITURE_ANCHOR: loadIfExists('bloombot_cozy_furniture_anchor'),
  BLOOMBOT_COZY_ATMOSPHERIC_MOMENT: loadIfExists('bloombot_cozy_atmospheric_moment'),
  // ─── tropical-paradise path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_TROPICAL_PARADISE_TROPICAL_SETTING: loadIfExists('bloombot_tropical_paradise_tropical_setting'),
  BLOOMBOT_TROPICAL_PARADISE_VEGETATION_ANCHOR: loadIfExists('bloombot_tropical_paradise_vegetation_anchor'),
  BLOOMBOT_TROPICAL_PARADISE_SURPRISE_CREATURE: loadIfExists('bloombot_tropical_paradise_surprise_creature'),
  SENSORY_POOLS: {
    scene: {
      lightcolor: load('sensory_lightcolor'),
    },
  },
};
