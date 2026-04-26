/**
 * GothBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/gothbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// All vibes push toward the Nightshade spine: deep purples, midnight blues, velvet blacks,
// poison greens, witch-fire green, fel-violet, blacklight, moonlit silver, tarnished silver,
// twilight lavender. Red is rare/accent-only — never window-glow, never blood-moon dominant.
const VIBE_COLOR = {
  cinematic: 'teal-and-amber cinematic grade, deep indigo shadows, warm candle highlights',
  dark: 'oil-black dominant with warm amber-and-orange candle glow cutting the shadow',
  epic: 'dramatic moonbeams through gothic arches, silver + fel-violet + forge-ember accents',
  nostalgic: 'faded sepia gothic, burnt umber + tarnished-gold + weathered plum',
  psychedelic: 'impossible violet + poisonous witch-fire green + amber flashes, hallucinatory gothic',
  ethereal: 'pearl-white ghost-mist, opalescent fog, lavender with pale-gold candle-gleam',
  arcane: 'deep violet + emerald ritual-glow + mystical candle-amber + witch-fire green mix',
  ancient: 'weathered bronze + stone-grey + warm alchemist-gold + crypt-dust + faded plum',
  enchanted: 'soft ghostly glow, lavender-and-midnight + warm candle secondary against twilight-indigo',
  fierce: 'stark violet + obsidian, forge-ember backlight, torch-orange rim-light',
  coquette: 'dark-rose pastel + cream + black lace + warm candle-amber + midnight-indigo',
  voltage: 'electric-violet storm-arcs + fel-green neon + amber-sparks, high contrast',
  nightshade: 'deep-violet moonlight + plum-shadows + silver starlight + candle-amber pool',
  macabre: 'inked plum-and-obsidian + fel-green dread + single warm-orange lantern accent',
  shimmer: 'tarnished silver + alchemist-gold glint amidst shadow + moonlit violet ground',
  surreal: 'impossible violet + witch-fire green + molten-amber pairings, hallucinatory gothic',
};

// GOTHIC_STRUCTURES may not exist yet during regen — load defensively
function loadOptional(name) {
  try { return load(name); } catch { return []; }
}

module.exports = {
  DARK_CHARACTERS: load('dark_characters'),
  CHARACTER_ACTIONS: load('character_actions'),
  GOTHIC_LANDSCAPES: load('gothic_landscapes'),
  GOTHIC_STRUCTURES: loadOptional('gothic_structures'),
  DARK_CREATURES: load('dark_creatures'),
  GOTH_WOMAN_ACCESSORIES: load('goth_woman_accessories'),
  CASTLEVANIA_CONTEXTS: load('castlevania_contexts'),
  COZY_GOTH_SETTINGS: load('cozy_goth_settings'),
  VAMPIRE_LOOKS: loadOptional('vampire_looks'),
  VAMPIRE_LIGHTING: loadOptional('vampire_lighting'),
  VAMPIRE_EYE_COLORS: loadOptional('vampire_eye_colors'),
  VAMPIRE_ETHNICITIES: loadOptional('vampire_ethnicities'),
  SCENE_GIRLS_ACTIONS: loadOptional('scene_girls_actions'),
  SCENE_GIRLS_LOCATIONS: loadOptional('scene_girls_locations'),
  SCENE_GIRLS_LIGHTING: loadOptional('scene_girls_lighting'),
  SCENE_GIRLS_CHARACTERS: loadOptional('scene_girls_characters'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
