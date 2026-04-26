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
  // Legacy monolithic (still used by pixel-action + pixel-character-moment)
  PIXEL_CHARACTERS: load('pixel_characters'),
  PIXEL_ACTION_MOMENTS: load('pixel_action_moments'),
  PIXEL_ENVIRONMENTS: load('pixel_environments'),

  // Decomposed axis pools
  PIXEL_ERAS: load('pixel_eras'),
  PIXEL_PRETTY_SETTINGS: load('pixel_pretty_settings'),
  PIXEL_PRETTY_ELEMENTS: load('pixel_pretty_elements'),
  PIXEL_FANTASY_SETTINGS: load('pixel_fantasy_settings'),
  PIXEL_FANTASY_BEINGS: load('pixel_fantasy_beings'),
  PIXEL_COZY_ROOMS: load('pixel_cozy_rooms'),
  PIXEL_COZY_DETAILS: load('pixel_cozy_details'),
  PIXEL_SCIFI_SETTINGS: load('pixel_scifi_settings'),
  PIXEL_SCIFI_ELEMENTS: load('pixel_scifi_elements'),
  PIXEL_COTTAGE_SETTINGS: load('pixel_cottage_settings'),
  PIXEL_COTTAGE_DETAILS: load('pixel_cottage_details'),
  PIXEL_TOWN_SETTINGS: load('pixel_town_settings'),
  PIXEL_TOWN_ACTIVITY: load('pixel_town_activity'),
  PIXEL_HORROR_SETTINGS: load('pixel_horror_settings'),
  PIXEL_HORROR_DREAD: load('pixel_horror_dread'),

  // Shared across all paths
  PIXEL_PERSPECTIVES: load('pixel_perspectives'),
  PIXEL_LIGHTING: load('pixel_lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  ATMOSPHERES: load('atmospheres'),
  VIBE_COLOR,
};
