/**
 * CoquetteBot — axis pools. All Sonnet-seeded pools.
 * Regenerate: node scripts/gen-seeds/coquettebot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cozy: 'warm amber glow, cream highlights, soft honey pastels',
  nostalgic: 'faded rose-gold, dusty pink, soft copper pastels',
  peaceful: 'soft pastel dawn, pale-blush-and-cream, gentle tranquil',
  whimsical: 'playful saturated pastels, buoyant warm cream light',
  ethereal: 'pearl-white mist, opalescent blush, prismatic rose sparkles',
  enchanted: 'soft magical sparkles, dreamy lavender-and-rose, luminous pink',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  shimmer: 'shimmering gold and rose particles, iridescent pastel highlights',
  surreal: 'dreamy impossible pink-and-pastel pairings, soft hallucinatory sweetness',
};

module.exports = {
  ADORABLE_CREATURES: load('adorable_creatures'),
  COTTAGECORE_SCENES: load('cottagecore_scenes'),
  PINK_NATURE_SCENES: load('pink_nature_scenes'),
  WHIMSICAL_SWEETS: load('whimsical_sweets'),
  COQUETTE_FASHION_MOMENTS: load('coquette_fashion_moments'),
  COQUETTE_GARMENTS: load('coquette_garments'),
  COUTURE_WEARERS: load('couture_wearers'),
  COUTURE_SCENES: load('couture_scenes'),
  CUTE_ACCESSORIES: load('cute_accessories'),
  PARISIAN_SCENES: load('parisian_scenes'),
  TEA_PARTY_SCENES: load('tea_party_scenes'),
  BEDROOM_SCENES: load('bedroom_scenes'),
  PRINCESS_HAIR: load('princess_hair'),
  PORTRAIT_WOMEN: load('portrait_women'),
  COUTURE_GOWNS: load('couture_gowns'),
  COASTAL_SCENES: load('coastal_scenes'),
  RAINY_COTTAGE_SCENES: load('rainy_cottage_scenes'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
