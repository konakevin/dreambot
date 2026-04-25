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
  SEA_CREATURES: load('sea_creatures'),
  DEEP_WONDER: load('deep_wonder'),
  DEEP_HORROR: load('deep_horror'),
  STORM_SURFACE: load('storm_surface'),
  GHOST_SHIPS: load('ghost_ships'),
  KRAKEN_SCENES: load('kraken_scenes'),
  SHIPWRECK_SCENES: load('shipwreck_scenes'),
  POLAR_SEAS: load('polar_seas'),
  COASTAL_CLIFFS: load('coastal_cliffs'),
  CALM_SEAS: load('calm_seas'),
  BIG_WAVES: load('big_waves'),
  COASTAL_GOLDEN: load('coastal_golden'),
  TROPICAL_PARADISE: load('tropical_paradise'),
  OCEAN_ATMOSPHERES: load('ocean_atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
