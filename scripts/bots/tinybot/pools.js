/**
 * TinyBot — axis pools. All Sonnet-seeded 200-entry pools.
 * Regenerate: node scripts/gen-seeds/tinybot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Each vibe pushes a DIFFERENT corner of the color spectrum. Diversified
// 2026-05-08 — previously all-warm-amber-honey, which was a major source of
// homogeneity. Now only `cozy` and `nostalgic` are warm; the rest are cool /
// monochrome / surreal / high-key to break the default.
const VIBE_COLOR = {
  cinematic: 'high-contrast monochrome noir, hard black shadows, single white key light, no color cast',
  cozy: 'warm amber miniature glow, honey highlights, inviting soft, warm key only',
  nostalgic: 'faded sepia-miniature, warm copper, dollhouse storybook, yellowed-paper tint',
  peaceful: 'soft pale-blue dawn light, cool gentle calm, NO warm tones, overcast diffused',
  whimsical: 'buoyant pastel pop palette, primary-color miniature catalog energy, flat clean',
  ethereal: 'pearl-white high-key miniature haze, everything dissolving into luminous pale',
  ancient: 'weathered bronze-and-dust monochrome, sun-bleached desert tones, no blue',
  enchanted: 'cool bioluminescent cyan-green glow on all surfaces, NO warm fill anywhere',
  shimmer: 'iridescent holographic rainbow sheen, oil-slick prismatic, hard white key',
  surreal: 'clashing impossible color pairings (lime-green sky + hot-pink ground), saturated-flat',
  // bex.ai-coded soft-pastel aesthetic — pink/lavender/lilac/magenta/pearl
  // with warm golden window-glow as focal contrast. Cherry-blossom-coded.
  'pastel-dream': 'soft pastel pink + lavender + lilac + magenta + pearl-white, warm golden window-glow focal contrast, cherry-blossom atmospheric tint, dreamy bokeh ambient, NO browns NO greens NO blues',
};

module.exports = {
  DOLLHOUSE_DIORAMAS: load('dollhouse_dioramas'),
  MINIATURE_LANDSCAPES: load('miniature_landscapes'),
  MACRO_NATURE_SUBJECTS: load('macro_nature_subjects'),
  MINIATURE_URBAN_SCENES: load('miniature_urban_scenes'),
  TINY_COZY_SCENES: load('tiny_cozy_scenes'),
  CONTAINED_WORLDS: load('contained_worlds'),
  TINY_CREATURES: load('tiny_creatures'),
  MICRO_FANTASY: load('micro_fantasy'),
  MINIATURE_INDUSTRY: load('miniature_industry'),
  COTTAGE_VILLAGE: load('cottage_village'),
  BORROWERS_SCENES: load('borrowers_scenes'),
  MUSHROOM_VILLAGE: load('mushroom_village'),
  PASTEL_VILLAGE: load('pastel_village'),
  TINY_FOOD_WORLD: load('tiny_food_world'),
  TINY_VEHICLES: load('tiny_vehicles'),
  TILT_SHIFT_LIGHTING: load('tilt_shift_lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  // ─── variety axes (2026-05-08) — break the warm-cozy-twilight default ─
  BIOME_AXIS: load('biome_axis'),
  WEATHER_AXIS: load('weather_axis'),
  LIGHTING_AXIS: load('lighting_axis'),
  ENERGY_AXIS: load('energy_axis'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
