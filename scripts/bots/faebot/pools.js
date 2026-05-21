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
  // ─── tiny-fae axis-system pools (2026-05-21) ───
  FAEBOT_TINY_FAE_CREATURE: loadIfExists('faebot_tiny_fae_creature'),
  FAEBOT_TINY_FAE_SCALE_ANCHOR_COMPANION: loadIfExists('faebot_tiny_fae_scale_anchor_companion'),
  FAEBOT_TINY_FAE_MACRO_PERCH: loadIfExists('faebot_tiny_fae_macro_perch'),
  FAEBOT_TINY_FAE_FOREST_MICRO_BIOME: loadIfExists('faebot_tiny_fae_forest_micro_biome'),
  FAEBOT_TINY_FAE_LIGHTING: loadIfExists('faebot_tiny_fae_lighting'),
  FAEBOT_TINY_FAE_WEATHER: loadIfExists('faebot_tiny_fae_weather'),
  FAEBOT_TINY_FAE_ACTION: loadIfExists('faebot_tiny_fae_action'),
  FAEBOT_TINY_FAE_MAGICAL_FLAVOR: loadIfExists('faebot_tiny_fae_magical_flavor'),
  FAEBOT_TINY_FAE_FOREGROUND_ANCHOR: loadIfExists('faebot_tiny_fae_foreground_anchor'),
  FAEBOT_TINY_FAE_BOTANICAL_ACCENT: loadIfExists('faebot_tiny_fae_botanical_accent'),
  // ─── dryad-portrait axis-system pools (2026-05-21) ───
  FAEBOT_DRYAD_PORTRAIT_CREATURE: loadIfExists('faebot_dryad_portrait_creature'),
  FAEBOT_DRYAD_PORTRAIT_EXPRESSION_MOMENT: loadIfExists('faebot_dryad_portrait_expression_moment'),
  FAEBOT_DRYAD_PORTRAIT_GESTURE_POSE: loadIfExists('faebot_dryad_portrait_gesture_pose'),
  FAEBOT_DRYAD_PORTRAIT_COMPOSITION: loadIfExists('faebot_dryad_portrait_composition'),
  FAEBOT_DRYAD_PORTRAIT_ADORNMENT: loadIfExists('faebot_dryad_portrait_adornment'),
  FAEBOT_DRYAD_PORTRAIT_FOREST_BACKDROP: loadIfExists('faebot_dryad_portrait_forest_backdrop'),
  FAEBOT_DRYAD_PORTRAIT_LIGHTING: loadIfExists('faebot_dryad_portrait_lighting'),
  FAEBOT_DRYAD_PORTRAIT_WEATHER: loadIfExists('faebot_dryad_portrait_weather'),
  FAEBOT_DRYAD_PORTRAIT_MAGICAL_FLAVOR: loadIfExists('faebot_dryad_portrait_magical_flavor'),
  FAEBOT_DRYAD_PORTRAIT_FOREGROUND_ANCHOR: loadIfExists('faebot_dryad_portrait_foreground_anchor'),
  // ─── fairy-court axis-system pools (2026-05-21) ───
  FAEBOT_FAIRY_COURT_SUBJECT: loadIfExists('faebot_fairy_court_subject'),
  FAEBOT_FAIRY_COURT_CEREMONIAL_MOMENT: loadIfExists('faebot_fairy_court_ceremonial_moment'),
  FAEBOT_FAIRY_COURT_COMPOSITION: loadIfExists('faebot_fairy_court_composition'),
  FAEBOT_FAIRY_COURT_REGALIA: loadIfExists('faebot_fairy_court_regalia'),
  FAEBOT_FAIRY_COURT_FOREST_BACKDROP: loadIfExists('faebot_fairy_court_forest_backdrop'),
  FAEBOT_FAIRY_COURT_LIGHTING: loadIfExists('faebot_fairy_court_lighting'),
  FAEBOT_FAIRY_COURT_WEATHER: loadIfExists('faebot_fairy_court_weather'),
  FAEBOT_FAIRY_COURT_MAGICAL_FLAVOR: loadIfExists('faebot_fairy_court_magical_flavor'),
  FAEBOT_FAIRY_COURT_FOREGROUND_ANCHOR: loadIfExists('faebot_fairy_court_foreground_anchor'),
  FAEBOT_FAIRY_COURT_SACRED_COMPANION: loadIfExists('faebot_fairy_court_sacred_companion'),
  VIBE_COLOR,
};
