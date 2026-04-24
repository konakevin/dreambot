/**
 * SteamBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/steambot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-brass cinematic grade, deep shadows, amber gaslight',
  dark: 'oil-black dominant, copper-patina accents, single-forge-amber',
  epic: 'dramatic brass-god-rays, rich copper highlights, heroic steam drama',
  nostalgic: 'faded sepia-brass, burnt-umber, weathered Victorian palette',
  peaceful: 'warm-amber gaslight interior, soft copper glow, quiet brass',
  whimsical: 'buoyant saturated steampunk-pastels, Ghibli-inflected brass',
  ethereal: 'pearl-white steam-mist, opalescent brass, luminous copper',
  arcane: 'deep violet alchemy, emerald copper-oxide, mystical brass',
  ancient: 'weathered bronze-and-copper, patina-green, deep umber',
  enchanted: 'soft magical glow, dreamy copper-and-gold, shimmer-steampunk',
  fierce: 'stark forge-orange and obsidian, savage smoke contrast',
  coquette: 'rose-gold brass, cream + blush corset tones (soft steampunk)',
  voltage: 'electric-blue Tesla arcs, neon brass accents, storm-contrast',
  nightshade: 'deep violet moonlit-brass, silver airship, plum shadows',
  macabre: 'blood-crimson and oil-black brass, dread-steampunk palette',
  shimmer: 'shimmering brass-dust, iridescent copper, warm gleam',
  surreal: 'impossible steampunk-color pairings, Ghibli-Howl hallucinatory',
};

module.exports = {
  STEAMPUNK_CHARACTERS: load('steampunk_characters'),
  STEAMPUNK_LANDSCAPES: load('steampunk_landscapes'),
  CONTRAPTION_TYPES: load('contraption_types'),
  AIRSHIP_SCENES: load('airship_scenes'),
  COZY_STEAMPUNK_SETTINGS: load('cozy_steampunk_settings'),
  STEAMPUNK_WOMEN_CANDID_MOMENTS: load('steampunk_women_candid_moments'),
  HYBRID_WORLDS: load('hybrid_worlds'),
  SPECTACLE_EVENTS: load('spectacle_events'),
  TRANSPORT_SCENES: load('transport_scenes'),
  STEAMPUNK_ATMOSPHERES: load('steampunk_atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
