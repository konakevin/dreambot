/**
 * TinyBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/tinybot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'warm teal-and-amber miniature grade, shallow depth',
  cozy: 'warm amber miniature glow, honey highlights, inviting soft',
  epic: 'dramatic miniature god-rays, rich warm highlights, scale-surprise',
  nostalgic: 'faded sepia-miniature, warm copper, dollhouse storybook',
  psychedelic: 'impossible pastel miniature shifts, hallucinatory tiny',
  peaceful: 'soft pastel miniature dawn, gentle warm calm',
  whimsical: 'buoyant miniature pastels, Ghibli-tiny palette, warm cream',
  ethereal: 'pearl-white miniature haze, luminous miniature mist',
  arcane: 'deep violet miniature glow, mystical tiny sparkle',
  ancient: 'weathered bronze-miniature, faded warm umber, tiny patina',
  enchanted: 'soft magical miniature glow, dreamy tiny sparkles',
  coquette: 'rose-pink miniature blush, cream tiny highlights',
  voltage: 'electric-blue miniature arcs, neon-tiny contrast',
  nightshade: 'deep violet moonlit-miniature, silver tiny-shadows',
  shimmer: 'shimmering gold-miniature particles, tiny iridescence',
  surreal: 'impossible miniature color pairings, clever-tiny sweetness',
};

module.exports = {
  DOLLHOUSE_DIORAMAS: load('dollhouse_dioramas'),
  MINIATURE_LANDSCAPES: load('miniature_landscapes'),
  MACRO_NATURE_SUBJECTS: load('macro_nature_subjects'),
  MINIATURE_URBAN_SCENES: load('miniature_urban_scenes'),
  TINY_COZY_SCENES: load('tiny_cozy_scenes'),
  CONTAINED_WORLDS: load('contained_worlds'),
  TINY_CREATURES: load('tiny_creatures'),
  TILT_SHIFT_LIGHTING: load('tilt_shift_lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
