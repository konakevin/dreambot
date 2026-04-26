/**
 * CuddleBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/cuddlebot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Cute-only VIBE_COLOR palette (no dark/fierce/macabre/nightshade/arcane etc.)
const VIBE_COLOR = {
  cozy: 'warm amber candle glow, soft golden highlights, honey tones',
  peaceful: 'soft pastel dawn, gentle pale blues and creams, tranquil',
  whimsical: 'playful buoyant pastels, warm creamy light, sparkle accents',
  enchanted: 'soft magical sparkles, dreamy lavender-and-rose, luminous',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  shimmer: 'shimmering gold particles, iridescent pastel highlights, glitter',
  nostalgic: 'warm copper and peach, faded storybook pastels, cozy sepia',
  ethereal: 'pearl-white ambient, opalescent mist, prismatic pastel sparkles',
  cinematic: 'warm teal-and-peach cinematic grade, soft luminous highlights',
  surreal: 'dreamy soft pastel impossibilities, gentle hallucinatory sweetness',
};

module.exports = {
  CUTE_CREATURES: load('cute_creatures'),
  HEARTWARMING_ACTIVITIES: load('heartwarming_activities'),
  COZY_MINIATURE_WORLDS: load('cozy_miniature_worlds'),
  PLUSHIE_SCENES: load('plushie_scenes'),
  PORTRAIT_FEATURES: load('portrait_features'),
  TINY_FRIENDSHIPS: load('tiny_friendships'),
  SLEEPY_NAP_SPOTS: load('sleepy_nap_spots'),
  RAINY_DAY_SCENES: load('rainy_day_scenes'),
  MINIATURE_FEAST_SCENES: load('miniature_feast_scenes'),
  BATH_TIME_SCENES: load('bath_time_scenes'),
  COTTAGECORE_SCENES: load('cottagecore_scenes'),
  OUTDOOR_ADVENTURES: load('outdoor_adventures'),
  SCENE_WEATHER: load('scene_weather'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
