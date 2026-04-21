/**
 * PixelBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/pixelbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange pixel grade, dramatic pixel shadows',
  dark: 'oil-black pixel palette, crimson-pixel accents',
  epic: 'dramatic pixel god-rays, rich pixel highlights',
  nostalgic: 'faded SNES-era palette, sepia-pixel',
  psychedelic: 'impossible pixel-color shifts, hallucinatory dithering',
  whimsical: 'buoyant pixel-pastel palette, warm pixel-cream',
  ethereal: 'pearl-white pixel mist, opalescent pixel haze',
  arcane: 'deep violet pixel magic glow, emerald pixel runes',
  enchanted: 'soft magical pixel glow, dreamy pixel sparkle',
  fierce: 'stark pixel crimson-and-obsidian, savage pixel strobe',
  coquette: 'rose-pixel pastel palette, pixel blush',
  voltage: 'electric-pixel blue arcs, neon pixel glow',
  nightshade: 'deep violet pixel moonlit, silver pixel shadows',
  macabre: 'inked pixel blood-and-black, dread pixel palette',
  shimmer: 'shimmering pixel gold particles, iridescent pixel glint',
  surreal: 'impossible pixel color pairings, hallucinatory pixel shifts',
};

module.exports = {
  PIXEL_PRETTY_SCENES: load('pixel_pretty_scenes'),
  PIXEL_FANTASY_SUBJECTS: load('pixel_fantasy_subjects'),
  PIXEL_SCI_FI_SUBJECTS: load('pixel_sci_fi_subjects'),
  PIXEL_COZY_SUBJECTS: load('pixel_cozy_subjects'),
  PIXEL_CHARACTERS: load('pixel_characters'),
  PIXEL_ACTION_MOMENTS: load('pixel_action_moments'),
  PIXEL_ENVIRONMENTS: load('pixel_environments'),
  PIXEL_LIGHTING: load('pixel_lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  ATMOSPHERES: load('atmospheres'),
  VIBE_COLOR,
};
