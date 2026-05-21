/**
 * ForestBot — axis pools. POC: single Sonnet-seeded pool of forest-fairy
 * scenes. Add more axes (lighting, atmosphere, palette variety) once the
 * look is approved.
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

// Single vibe-color line for now — peaceful is the default mood for this
// bot. Three options for variety; each entry is a short atmospheric
// secondary-light cue that pairs with the gouache palette.
const VIBE_COLOR = {
  peaceful: 'soft golden afternoon glow filtering through canopy, dappled warm calm',
  enchanted: 'soft magical violet-twilight glow, faint pollen-light particles, dreamy lavender-blue',
  ethereal: 'pearl-white morning mist, luminous pale haze, opalescent painted softness',
  nostalgic: 'faded warm sepia-gold, painted-storybook softness, gentle umber',
  whimsical: 'buoyant pastel forest tones, Ghibli-warm cream highlights, playful softness',
};

module.exports = {
  FOREST_FAIRY_SCENES: load('forest_fairy_scenes'),
  FOREST_CREATURES: load('forest_creatures'),
  DRYAD_PORTRAITS: load('dryad_portraits'),
  TINY_FAE: load('tiny_fae'),
  FAIRY_COURT: load('fairy_court'),
  ENCHANTED_VISTA: load('enchanted_vista'),
  FAE_VILLAGES: load('fae_villages'),
  VILLAGE_LIGHTING: load('village_lighting'),
  VILLAGE_WILDLIFE: load('village_wildlife'),
  VILLAGE_FOREST_DETAIL: load('village_forest_detail'),
  // ─── flower-fairy path (R11 reset, 2026-05-17) ───
  FLOWER_FAIRY_CREATURES: loadIfExists('flower_fairy_creatures'),
  FLOWER_FAIRY_SCENES: loadIfExists('flower_fairy_scenes'),
  // ─── forest-fairy-scene axis-system pools (2026-05-20) ───
  FAEBOT_FOREST_FAIRY_SCENE_CREATURE: loadIfExists('faebot_forest_fairy_scene_creature'),
  FAEBOT_FOREST_FAIRY_SCENE_BIOME: loadIfExists('faebot_forest_fairy_scene_biome'),
  FAEBOT_FOREST_FAIRY_SCENE_LIGHTING: loadIfExists('faebot_forest_fairy_scene_lighting'),
  FAEBOT_FOREST_FAIRY_SCENE_WEATHER: loadIfExists('faebot_forest_fairy_scene_weather'),
  FAEBOT_FOREST_FAIRY_SCENE_FOREGROUND_ANCHOR: loadIfExists('faebot_forest_fairy_scene_foreground_anchor'),
  FAEBOT_FOREST_FAIRY_SCENE_BOTANICAL_ACCENT: loadIfExists('faebot_forest_fairy_scene_botanical_accent'),
  FAEBOT_FOREST_FAIRY_SCENE_CANDID_ACTION: loadIfExists('faebot_forest_fairy_scene_candid_action'),
  FAEBOT_FOREST_FAIRY_SCENE_MAGICAL_FLAVOR: loadIfExists('faebot_forest_fairy_scene_magical_flavor'),
  FAEBOT_FOREST_FAIRY_SCENE_SCALE_PROVER: loadIfExists('faebot_forest_fairy_scene_scale_prover'),
  FAEBOT_FOREST_FAIRY_SCENE_COMPANION: loadIfExists('faebot_forest_fairy_scene_companion'),
  // ─── flower-fairy axis-system pools (2026-05-20) ───
  FAEBOT_FLOWER_FAIRY_CREATURE: loadIfExists('faebot_flower_fairy_creature'),
  FAEBOT_FLOWER_FAIRY_BIOME: loadIfExists('faebot_flower_fairy_biome'),
  FAEBOT_FLOWER_FAIRY_LIGHTING: loadIfExists('faebot_flower_fairy_lighting'),
  FAEBOT_FLOWER_FAIRY_WEATHER: loadIfExists('faebot_flower_fairy_weather'),
  FAEBOT_FLOWER_FAIRY_FOREGROUND_ANCHOR: loadIfExists('faebot_flower_fairy_foreground_anchor'),
  FAEBOT_FLOWER_FAIRY_BOTANICAL_ACCENT: loadIfExists('faebot_flower_fairy_botanical_accent'),
  FAEBOT_FLOWER_FAIRY_CANDID_ACTION: loadIfExists('faebot_flower_fairy_candid_action'),
  FAEBOT_FLOWER_FAIRY_MAGICAL_FLAVOR: loadIfExists('faebot_flower_fairy_magical_flavor'),
  FAEBOT_FLOWER_FAIRY_SCALE_PROVER: loadIfExists('faebot_flower_fairy_scale_prover'),
  FAEBOT_FLOWER_FAIRY_COMPANION: loadIfExists('faebot_flower_fairy_companion'),
  VIBE_COLOR,
};
