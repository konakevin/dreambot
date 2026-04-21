/**
 * GothBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/gothbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-crimson cinematic grade, deep shadows, dramatic highlights',
  dark: 'oil-black dominant, charcoal shadow, single candle-amber key-light',
  epic: 'dramatic god-rays through gothic arches, crimson accents, deep black',
  nostalgic: 'faded sepia gothic, burnt umber and oxblood, weathered palette',
  psychedelic: 'impossible violet + poisonous green, hallucinatory gothic hues',
  whimsical: 'Tim-Burton muted palette, moss-grey + rust + faded purple',
  ethereal: 'pearl-white ghost-mist, opalescent fog, ashen tones',
  arcane: 'deep violet and emerald ritual-glow, mystical candle-amber',
  ancient: 'weathered bronze + stone-grey, crypt-dust + faded crimson',
  enchanted: 'soft ghostly glow, lavender-and-rose against midnight',
  fierce: 'stark blood-red and obsidian, savage backlight, cold white',
  coquette: 'dark-rose pastel + cream + black lace (gothic-lolita soft edge)',
  voltage: 'electric-violet storm-arcs, neon gothic accents, contrast',
  nightshade: 'deep-violet moonlight + plum-shadows + silver starlight',
  macabre: 'inked blood-crimson on charcoal, dread-atmosphere palette',
  shimmer: 'tarnished silver + gold glint amidst shadow, gothic gleam',
  surreal: 'impossible color pairings with gothic palette, hallucinatory dread',
};

module.exports = {
  DARK_CHARACTERS: load('dark_characters'),
  GOTHIC_LANDSCAPES: load('gothic_landscapes'),
  DARK_CREATURES: load('dark_creatures'),
  GOTH_WOMAN_ACCESSORIES: load('goth_woman_accessories'),
  CASTLEVANIA_CONTEXTS: load('castlevania_contexts'),
  COZY_GOTH_SETTINGS: load('cozy_goth_settings'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
