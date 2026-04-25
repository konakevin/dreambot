/**
 * DragonBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/dragonbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, deep shadows, epic highlights',
  cozy: 'warm amber hearth glow, firelit amber + deep brown, inviting tones',
  epic: 'dramatic god-rays, rich golden highlights, heroic deep shadows',
  nostalgic: 'warm copper-sepia, faded mythic pastels, weathered storybook',
  psychedelic: 'impossible magenta arcane colors, luminous acid-green, violet-glow',
  peaceful: 'soft diffuse daylight, gentle pastoral pastels, breath-worthy calm',
  whimsical: 'buoyant saturated pastels, warm Ghibli-creamy light',
  ethereal: 'pearl-white mist, opalescent fog, luminous pale tones',
  arcane: 'deep violet and emerald spirit-glow, mystic luminous candles, runic shimmer',
  ancient: 'molten amber sunbeams, bronze patina, weathered mythic stone',
  enchanted: 'soft magical glow, dreamy lavender-and-rose, Ghibli-shimmer',
  fierce: 'stark amber-and-obsidian, savage backlight, blood-red accents',
  coquette: 'rose-blush atmosphere, cream highlights (rare for fantasy, soft edge)',
  voltage: 'electric-blue magical arcs, neon spell-glow accents, contrast',
  nightshade: 'deep violet and silver moonlight, plum shadows, starlit',
  macabre: 'inked blood-red-and-black, dark-fantasy dread atmosphere',
  shimmer: 'shimmering gold particulate, iridescent highlights, enchanted glow',
  surreal: 'impossible color pairings, arcane hallucinatory shifts',
};

module.exports = {
  FANTASY_CHARACTERS: load('fantasy_characters'),
  FANTASY_LANDSCAPES: load('fantasy_landscapes'),
  EPIC_MOMENTS: load('epic_moments'),
  DRAGON_TYPES: load('dragon_types'),
  ARCANE_PHENOMENA: load('arcane_phenomena'),
  COZY_ARCANE_SETTINGS: load('cozy_arcane_settings'),
  ARCHITECTURAL_ELEMENTS: load('architectural_elements'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  ENCHANTED_SCENES: load('enchanted_scenes'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
