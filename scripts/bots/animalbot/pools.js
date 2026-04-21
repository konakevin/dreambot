/**
 * AnimalBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/animalbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, dramatic highlights, deep shadows',
  dark: 'deep moody charcoal, low-key shadows, single dramatic rim-light',
  cozy: 'warm amber sunlight, soft golden glow, inviting warm tones',
  epic: 'god rays and rim-light, deep shadows, heroic backlighting',
  nostalgic: 'warm copper and sepia, faded gold, soft film-grain palette',
  peaceful: 'soft diffuse daylight, gentle pastels, luminous calm',
  whimsical: 'playful saturated pastels, warm buoyant light',
  ethereal: 'pearl-white mist, opalescent haze, luminous pale tones',
  arcane: 'deep violet and emerald twilight, mystical rim-light',
  ancient: 'molten amber light, bronze earth tones, weathered palette',
  enchanted: 'soft magical glow, dreamy golden light',
  fierce: 'stark amber contrast, savage backlight, high-drama shadows',
  coquette: 'rose-blush atmosphere, cream highlights, soft golden-hour',
  voltage: 'electric blue storm-accents, neon rim-light',
  nightshade: 'deep violet and silver moonlight, plum-tones, starlit',
  shimmer: 'shimmering gold particulate, iridescent highlights',
  surreal: 'impossible color pairings, hallucinatory saturation shifts',
};

module.exports = {
  LAND_ANIMALS: load('land_animals'),
  PORTRAIT_FRAMINGS: load('portrait_framings'),
  LANDSCAPE_CONTEXTS: load('landscape_contexts'),
  ACTION_MOMENTS: load('action_moments'),
  TENDER_PAIRINGS: load('tender_pairings'),
  COZY_ANIMAL_MOMENTS: load('cozy_animal_moments'),
  SPECTACLE_AMPLIFIERS: load('spectacle_amplifiers'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
