const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// 2026-06-15: de-Hollywood'd to match earth/pools.js — the bot is locked to
// `cinematic`, so this rides every beach render. Dropped the "teal-and-orange
// cinematic" VFX grade + the sci-fi-coded keys (magical / electric-blue-neon /
// iridescent / impossible-color hallucinatory) for true-to-life tropical color.
const VIBE_COLOR = {
  cinematic: 'natural tropical color, true-to-life sunlight, soft sunset warmth',
  cozy: 'warm amber sun, honey-tropical, golden-sand glow',
  epic: 'dramatic beach god-rays, heroic coast-scale, saturated horizon',
  nostalgic: 'faded polaroid-beach, warm copper sunset, dusty-pastel',
  peaceful: 'soft diffuse tropical daylight, gentle sky, calm turquoise',
  whimsical: 'buoyant beach-pastels, warm playful tropical',
  ethereal: 'pearl-white morning-mist, opalescent lagoon',
  ancient: 'weathered driftwood + sun-bleached, faded coastal',
  enchanted: 'soft warm beach glow, gentle tropical light',
  coquette: 'rose-pink sunset beach, cream sand, soft blush',
  voltage: 'dramatic storm light over the water, charged grey-blue sky',
  shimmer: 'warm silver-gold water, soft natural sand highlights',
  surreal: 'rich natural tropical color, soft dreamy light',
};

module.exports = {
  COASTAL_VISTAS: load('coastal_vistas'),
  WAVE_MOMENTS: load('wave_moments'),
  TROPICAL_PARADISE_SCENES: load('tropical_paradise_scenes'),
  TIDE_POOL_SCENES: load('tide_pool_scenes'),
  COZY_COAST_SCENES: load('cozy_coast_scenes'),
  SEA_COLORS: load('sea_colors'),
  COASTAL_WEATHER_MOMENTS: load('coastal_weather_moments'),
  ATMOSPHERES: load('atmospheres'),
  HAWAII_COASTAL_SPACES: load('hawaii_coastal_spaces'),
  REEF_PARADISE_SCENES: load('reef_paradise_scenes'),
  BIG_WAVE_SCENES: load('big_wave_scenes'),
  BEACH_NIGHT_SCENES: load('beach_night_scenes'),
  EPIC_SUNSET_SCENES: load('epic_sunset_scenes'),
  TROPICAL_FLOWER_ARRANGEMENTS: load('tropical_flower_arrangements'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    scene: {
      smell: load('sensory_scene_smell'),
      sound: load('sensory_scene_sound'),
      touch: load('sensory_scene_touch'),
      temperature: load('sensory_scene_temperature'),
      weight: load('sensory_scene_weight'),
      air: load('sensory_scene_air'),
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
