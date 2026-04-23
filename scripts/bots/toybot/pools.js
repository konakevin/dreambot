/**
 * ToyBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/toybot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Distinct palette per vibe — deliberately NOT warm-and-cool variants.
// Every vibe should push Flux to a DIFFERENT corner of the color spectrum.
const VIBE_COLOR = {
  cinematic: 'high-contrast noir palette, hard black shadows, single white key light, no color cast',
  cozy: 'overall-warm monochrome scene, all cream-and-honey tones, NO cool fill, flat even glow',
  epic: 'hard white high-noon daylight, short sharp shadows, washed-clean saturation',
  nostalgic: 'faded-Polaroid color grade, yellowed-paper tint, green-shifted shadows, no blue',
  peaceful: 'overcast-soft flat daylight, pale-grey sky, zero shadow contrast, muted desaturation',
  whimsical: 'primary-color saturation pop (red / yellow / blue on white set), flat catalog lighting, NO chiaroscuro',
  ethereal: 'all-white high-key floating light, milk-fog atmosphere, everything dissolves into pale',
  arcane: 'monochrome deep-violet ONLY palette, NO warm tones anywhere, purple-on-purple, crystal-glow rim',
  ancient: 'sepia-monochrome faded-desert palette, bronze-and-dust, no blue channel, sun-bleached',
  enchanted: 'bioluminescent cyan-green glow on all surfaces, NO warm counter-light, aquarium-feel',
  coquette: 'pastel-pink monochrome — rose / bubblegum / cream ONLY, NO orange NO blue, soft-box flat',
  voltage: 'electric-magenta-and-cyan neon-only palette, pitch-black negative space, NO warm highlights',
  nightshade: 'deep-indigo nocturnal monochrome, silver moon-rim, ultraviolet accents, NO warm glow',
  shimmer: 'iridescent pearl-holographic palette, shifting rainbow-oil-slick sheen, hard white key',
  surreal: 'clashing impossible color pairings (e.g. lime-green sky + hot-pink ground + purple shadows), saturated-flat',
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
