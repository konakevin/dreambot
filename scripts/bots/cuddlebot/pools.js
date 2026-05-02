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
  SLEEPY_NAP_SPOTS: load('sleepy_nap_spots'),
  RAINY_DAY_SCENES: load('rainy_day_scenes'),
  MINIATURE_FEAST_SCENES: load('miniature_feast_scenes'),
  BATH_TIME_SCENES: load('bath_time_scenes'),
  COTTAGECORE_SCENES: load('cottagecore_scenes'),
  OUTDOOR_ADVENTURES: load('outdoor_adventures'),
  AQUATIC_CREATURES: load('aquatic_creatures'),
  AQUATIC_SCENES: load('aquatic_scenes'),
  JUNGLE_CREATURES: load('jungle_creatures'),
  JUNGLE_SCENES: load('jungle_scenes'),
  ARCTIC_CREATURES: load('arctic_creatures'),
  ARCTIC_SCENES: load('arctic_scenes'),
  NIGHT_MEADOW_SCENES: load('night_meadow_scenes'),
  AQUATIC_VILLAGE_SCENES: load('aquatic_village_scenes'),
  JUNGLE_VILLAGE_SCENES: load('jungle_village_scenes'),
  ARCTIC_VILLAGE_SCENES: load('arctic_village_scenes'),
  TWILIGHT_VILLAGE_SCENES: load('twilight_village_scenes'),
  SUNNY_PAIR_SCENES: load('sunny_pair_scenes'),
  SUNNY_VILLAGE_SCENES: load('sunny_village_scenes'),
  COZY_INTERIOR_SCENES: load('cozy_interior_scenes'),
  SCENE_WEATHER: load('scene_weather'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  // Sensory anchor pools — 2 contexts × 7 channels × 100 entries.
  SENSORY_POOLS: {
    creature: {
      smell: load('sensory_creature_smell'),
      sound: load('sensory_creature_sound'),
      touch: load('sensory_creature_touch'),
      temperature: load('sensory_creature_temperature'),
      weight: load('sensory_creature_weight'),
      air: load('sensory_creature_air'),
      lightcolor: load('sensory_creature_lightcolor'),
    },
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
