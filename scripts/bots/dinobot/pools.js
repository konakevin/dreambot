const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange Jurassic cinematic grade, deep shadows',
  cozy: 'warm amber jungle glow, honey-filtered canopy',
  dark: 'oil-black dominant, single amber-sunset highlight',
  epic: 'dramatic god-rays through prehistoric forest, heroic scale',
  ancient: 'weathered primordial bronze, faded patina, deep-umber',
  ethereal: 'soft golden-hour glow, luminous pastel sky, dreamlike clarity',
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
  PREHISTORIC_ATMOSPHERES: load('prehistoric_atmospheres'),
  LIGHTING: load('lighting'),
  DINO_VISUAL_CUES: load('dino_visual_cues'),
  SCENE_PALETTES: load('scene_palettes'),
  HERD_SCENES: load('herd_scenes'),
  CLASH_SCENES: load('clash_scenes'),
  NESTING_SCENES: load('nesting_scenes'),
  SWAMP_SCENES: load('swamp_scenes'),
  OCEAN_SCENES: load('ocean_scenes'),
  VOLCANIC_SCENES: load('volcanic_scenes'),
  SILHOUETTE_SCENES: load('silhouette_scenes'),
  MICRO_DETAILS: load('micro_details'),
  EXTINCTION_SCENES: load('extinction_scenes'),
  COZY_DINO_ACTIONS: load('cozy_dino_actions'),
  PACK_DINO_ACTIONS: load('pack_dino_actions'),
  // Aerial-perspectives path
  AERIAL_SUBJECTS: load('aerial_subjects'),
  AERIAL_ACTIONS: load('aerial_actions'),
  AERIAL_SETTINGS: load('aerial_settings'),
  CAMERA_ANGLES: load('camera_angles'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    dinosaur: { smell: load('sensory_dinosaur_smell'), sound: load('sensory_dinosaur_sound'), touch: load('sensory_dinosaur_touch'), temperature: load('sensory_dinosaur_temperature'), weight: load('sensory_dinosaur_weight'), air: load('sensory_dinosaur_air'), lightcolor: load('sensory_dinosaur_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
