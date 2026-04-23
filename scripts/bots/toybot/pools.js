/**
 * ToyBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/toybot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic toy-photography grade, deep shadows',
  cozy: 'warm amber toy-room light, practical lamp-glow, inviting palette',
  epic: 'dramatic backlit toy-studio god-rays, heroic warm highlights',
  nostalgic: 'faded 80s-toy-catalog palette, copper-and-cream',
  peaceful: 'soft diffuse toy-photography daylight, gentle pastels',
  whimsical: 'buoyant saturated toy-color palette, warm cream',
  ethereal: 'pearl-white toy-fog, opalescent toy-set mist',
  arcane: 'deep violet toy-lighting, emerald toy-set glow',
  ancient: 'weathered bronze toy-patina, faded-paint palette',
  enchanted: 'soft magical toy-glow, sparkle-dust on set',
  coquette: 'rose-pink toy-set blush, cream highlights (soft toy)',
  voltage: 'electric-blue toy-studio arcs, neon accents',
  nightshade: 'deep violet moonlit toy-set, silver toy-shadows',
  shimmer: 'shimmering toy-gold particulate, iridescent toy-glint',
  surreal: 'impossible toy-color pairings, dreamy toy-hallucinatory',
};

module.exports = {
  LEGO_SCENES: load('lego_scenes'),
  CLAYMATION_SCENES: load('claymation_scenes'),
  VINYL_DIORAMAS: load('vinyl_dioramas'),
  ACTION_FIGURE_BATTLES: load('action_figure_battles'),
  SACKBOY_SCENES: load('sackboy_scenes'),
  TOY_LANDSCAPES: load('toy_landscapes'),
  CALICO_SCENES: load('calico_scenes'),
  SHORTCAKE_SCENES: load('shortcake_scenes'),
  BARBIE_SCENES: load('barbie_scenes'),
  TABLETOP_SCENES: load('tabletop_scenes'),
  ARMY_MEN_SCENES: load('army_men_scenes'),
  GI_JOE_SCENES: load('gi_joe_scenes'),
  ACTION_HERO_SCENES: load('action_hero_scenes'),
  LEGO_LANDSCAPES: load('lego_landscapes'),
  CLAYMATION_LANDSCAPES: load('claymation_landscapes'),
  VINYL_LANDSCAPES: load('vinyl_landscapes'),
  ACTION_FIGURE_LANDSCAPES: load('action_figure_landscapes'),
  SACKBOY_LANDSCAPES: load('sackboy_landscapes'),
  CALICO_LANDSCAPES: load('calico_landscapes'),
  SHORTCAKE_LANDSCAPES: load('shortcake_landscapes'),
  BARBIE_LANDSCAPES: load('barbie_landscapes'),
  TABLETOP_LANDSCAPES: load('tabletop_landscapes'),
  ARMY_MEN_LANDSCAPES: load('army_men_landscapes'),
  GI_JOE_LANDSCAPES: load('gi_joe_landscapes'),
  ACTION_HERO_LANDSCAPES: load('action_hero_landscapes'),
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
