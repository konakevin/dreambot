const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange Jurassic cinematic grade, deep shadows',
  dark: 'oil-black dominant, single amber-sunset highlight',
  cozy: 'warm amber jungle glow, honey-filtered canopy',
  epic: 'dramatic god-rays through prehistoric forest, heroic scale',
  nostalgic: 'faded sepia-prehistoric, warm copper, weathered palette',
  ethereal: 'pearl-white prehistoric mist, opalescent dawn',
  ancient: 'weathered primordial bronze, faded patina, deep-umber',
  enchanted: 'soft magical prehistoric glow, dreamy-primordial',
  fierce: 'stark crimson + obsidian + savage amber',
  voltage: 'electric-blue lightning arcs, storm-prehistoric palette',
  nightshade: 'deep violet moonlit prehistoric, silver shadows',
  shimmer: 'shimmering gold-amber dust, iridescent scales',
  surreal: 'impossible prehistoric color pairings, dreamy primordial',
};

module.exports = {
  DINO_SPECIES: load('dino_species'),
  PREHISTORIC_SETTINGS: load('prehistoric_settings'),
  DINO_ACTIONS: load('dino_actions'),
  PACK_SCENES: load('pack_scenes'),
  COZY_DINO_MOMENTS: load('cozy_dino_moments'),
  PREHISTORIC_ATMOSPHERES: load('prehistoric_atmospheres'),
  LIGHTING: load('lighting'),
  DINO_VISUAL_CUES: load('dino_visual_cues'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
