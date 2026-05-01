const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, deep ocean shadows',
  dark: 'deep abyssal blue-black, oil-dark shadows, single cold light',
  cozy: 'warm sunlit-shallow palette, honey-warm tropical turquoise',
  epic: 'dramatic storm-lit ocean, heroic saturated deep blue',
  nostalgic: 'faded warm sepia-marine, vintage maritime copper',
  peaceful: 'soft diffuse pale-blue, gentle sunlit calm sea',
  ethereal: 'pearl-white ocean mist, opalescent surface shimmer',
  ancient: 'weathered bronze wreck, barnacle patina, deep-sea ancient',
  enchanted: 'soft magical marine glow, sparkle-particle dreamy',
  fierce: 'stark dark ocean, white-cap fury, storm-gray and foam',
  voltage: 'electric-blue bioluminescence, neon plankton arcs',
  nightshade: 'deep violet midnight ocean, silver moonpath on water',
  shimmer: 'shimmering silver sea surface, iridescent scale-light',
  surreal: 'impossible ocean color pairings, hallucinatory marine',
};

module.exports = {
  REEF_SCENES: load('reef_scenes'),
  DEEP_WONDER: load('deep_wonder'),
  STORM_SURFACE: load('storm_surface'),
  GHOST_SHIPS: load('ghost_ships'),
  KRAKEN_SCENES: load('kraken_scenes'),
  SHIPWRECK_SCENES: load('shipwreck_scenes'),
  LOST_CITY_SCENES: load('lost_city_scenes'),
  PIRATE_SCENES: load('pirate_scenes'),
  UNDERSEA_SEASCAPE_SCENES: load('undersea_seascape_scenes'),
  OCEAN_CAMERA_ANGLES: load('ocean_camera_angles'),
  POLAR_SEAS: load('polar_seas'),
  COASTAL_CLIFFS: load('coastal_cliffs'),
  CALM_SEAS: load('calm_seas'),
  BIG_WAVES: load('big_waves'),
  COASTAL_GOLDEN: load('coastal_golden'),
  TROPICAL_PARADISE: load('tropical_paradise'),
  OCEAN_ATMOSPHERES: load('ocean_atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  OCEAN_SURFACE_LIGHTING: load('ocean_surface_lighting'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
