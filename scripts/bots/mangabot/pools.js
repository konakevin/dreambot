/**
 * MangaBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/mangabot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'anime cinematic palette, teal-and-orange depth, saturated contrast',
  dark: 'deep inked shadows, charcoal-and-blood palette, Akira-dark atmosphere',
  cozy: 'Ghibli warm golden ambient, soft amber domestic glow',
  epic: 'Demon-Slayer dramatic god-rays, heroic lighting, saturated palette',
  nostalgic: 'Shinkai late-summer amber, copper sunset, faded pastels',
  peaceful: 'Ghibli morning softness, gentle pastel diffuse, pastoral calm',
  whimsical: 'buoyant Ghibli-saturated pastels, dreamy warmth',
  ethereal: 'Ghibli-spirit-world opalescent mist, pearl-white luminance',
  arcane: 'deep violet and emerald spirit-light, mystical Mononoke aura',
  enchanted: 'soft magical glow, dreamy lavender-and-rose, Ghibli-shimmer',
  coquette: 'rose-pink blush atmosphere, soft pastel-shoujo palette',
  voltage: 'Akira neon-blue arcs, electric cyberpunk accents, Blade-Runner vibrance',
  nightshade: 'deep violet moonlight, plum shadows, anime-twilight silvers',
  macabre: 'inked blood-red-and-black, dark-fantasy anime dread',
  shimmer: 'anime sparkle effects, iridescent shoujo highlights, glitter accents',
  surreal: 'dreamy impossible color pairings, Mononoke-spirit-shift atmosphere',
};

module.exports = {
  ANIME_CHARACTERS: load('anime_characters'),
  JAPANESE_LANDSCAPES: load('japanese_landscapes'),
  MYTHOLOGICAL_BEINGS: load('mythological_beings'),
  COZY_ANIME_MOMENTS: load('cozy_anime_moments'),
  KAWAII_MOMENTS: load('kawaii_moments'),
  SLICE_OF_LIFE_MOMENTS: load('slice_of_life_moments'),
  NEO_TOKYO_SETTINGS: load('neo_tokyo_settings'),
  CULTURAL_ELEMENTS: load('cultural_elements'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  CHARACTER_DETAILS: load('character_details'),
  VIBE_COLOR,
};
