/**
 * TitanBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/titanbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-gold cinematic grade, deep shadow, divine highlight',
  dark: 'oil-black dominant, blood-crimson accent, low-key mythic atmosphere',
  epic: 'dramatic god-rays, rich gold-and-crimson, heroic scale',
  nostalgic: 'faded sepia-gold, burnt umber, weathered mythic palette',
  psychedelic: 'impossible divine-color shifts, hallucinatory prismatic',
  ethereal: 'pearl-white divine mist, opalescent heaven-haze, luminous',
  arcane: 'deep violet and emerald divine-glow, mystical cosmic shimmer',
  ancient: 'weathered bronze + sand-ochre + deep-umber patina',
  enchanted: 'soft magical glow, dreamy lavender-and-gold divine',
  fierce: 'stark blood-crimson and obsidian, savage divine contrast',
  coquette: 'rose-blush heaven atmosphere, cream and gold (soft divine)',
  voltage: 'electric-blue thunderbolt arcs, storm-god palette',
  nightshade: 'deep violet underworld, silver moonlight, plum shadows',
  macabre: 'inked blood and bone, underworld dread palette',
  shimmer: 'shimmering gold-dust, divine iridescent highlights',
  surreal: 'impossible divine color pairings, hallucinatory mythic shifts',
};

module.exports = {
  DEITIES: load('deities'),
  PANTHEONS_AND_REGALIA: load('pantheons_and_regalia'),
  MYTHOLOGICAL_LANDSCAPES: load('mythological_landscapes'),
  EPIC_BATTLES: load('epic_battles'),
  MYTHIC_CREATURES: load('mythic_creatures'),
  MYTHIC_WOMEN_CANDID_MOMENTS: load('mythic_women_candid_moments'),
  COZY_MYTHIC_SETTINGS: load('cozy_mythic_settings'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  ARCHITECTURAL_ELEMENTS: load('architectural_elements'),
  VIBE_COLOR,
};
