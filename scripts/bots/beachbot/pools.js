const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange beach cinematic, sunset saturation',
  cozy: 'warm amber sun, honey-tropical, golden-sand glow',
  epic: 'dramatic beach god-rays, heroic coast-scale, saturated horizon',
  nostalgic: 'faded polaroid-beach, warm copper sunset, dusty-pastel',
  peaceful: 'soft diffuse tropical daylight, gentle sky, calm turquoise',
  whimsical: 'buoyant beach-pastels, warm playful tropical',
  ethereal: 'pearl-white morning-mist, opalescent lagoon',
  ancient: 'weathered driftwood + sun-bleached, faded coastal',
  enchanted: 'soft magical beach glow, dreamy tropical sparkle',
  coquette: 'rose-pink sunset beach, cream sand, soft blush',
  voltage: 'electric-blue crystal water, neon tropical accents',
  shimmer: 'shimmering silver-gold water, iridescent sand highlights',
  surreal: 'impossible beach-color pairings, dreamy tropical hallucinatory',
};

module.exports = {
  COASTAL_VISTAS: load('coastal_vistas'),
  WAVE_MOMENTS: load('wave_moments'),
  TROPICAL_PARADISE_SCENES: load('tropical_paradise_scenes'),
  BEACH_LANDSCAPE_SCENES: load('beach_landscape_scenes'),
  TIDE_POOL_SCENES: load('tide_pool_scenes'),
  BEACH_MOMENTS: load('beach_moments'),
  COZY_COAST_SCENES: load('cozy_coast_scenes'),
  SEA_COLORS: load('sea_colors'),
  COASTAL_WEATHER_MOMENTS: load('coastal_weather_moments'),
  ATMOSPHERES: load('atmospheres'),
  HAWAII_COASTAL_SPACES: load('hawaii_coastal_spaces'),
  REEF_PARADISE_SCENES: load('reef_paradise_scenes'),
  BIG_WAVE_SCENES: load('big_wave_scenes'),
  SEASHELL_SCENES: load('seashell_scenes'),
  BEACH_NIGHT_SCENES: load('beach_night_scenes'),
  EPIC_SUNSET_SCENES: load('epic_sunset_scenes'),
  TROPICAL_FLOWER_ARRANGEMENTS: load('tropical_flower_arrangements'),
  VIBE_COLOR,
};
