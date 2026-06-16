const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// 2026-06-15: de-Hollywood'd. The bot is locked to `cinematic` (TRAVEL_VIBES),
// so this colorPalette rides EVERY render — the old "teal-and-orange cinematic
// grade" was the forced VFX color-signature that made real nature read as a
// processed/CGI movie still (Kevin: "nothing hyperreal"). Now a true-to-life
// natural grade. The sci-fi-coded keys (magical inner-glow / electric-blue /
// iridescent / impossible-color) are neutralized too in case they're ever
// re-enabled — they directly contradict EarthBot's real-Earth identity.
const VIBE_COLOR = {
  cinematic: 'natural true-to-life color, soft warm-to-cool depth, gentle atmospheric distance',
  cozy: 'warm amber golden-hour glow, honey light through canopy',
  dark: 'deep moody storm-light, rich shadows with single bright break',
  epic: 'dramatic god-rays through clouds, heroic golden scale',
  nostalgic: 'faded warm copper tones, golden-age film palette',
  peaceful: 'soft pastel dawn wash, gentle diffuse luminosity',
  ethereal: 'soft golden-hour glow, luminous pastel sky, gentle clarity',
  ancient: 'weathered bronze patina, deep-umber earth tones',
  enchanted: 'soft warm backlight, gentle hazy atmosphere',
  voltage: 'dramatic storm light, charged grey-blue sky',
  nightshade: 'deep violet moonlit landscape, silver-blue shadows',
  shimmer: 'warm gold-amber light, soft natural surface reflections',
  surreal: 'rich natural color, soft dreamy light',
};

module.exports = {
  EPIC_VISTAS: load('epic_vistas'),
  HIDDEN_CORNERS: load('hidden_corners'),
  SACRED_LIGHT_MOMENTS: load('sacred_light_moments'),
  SEASONAL_SCENES: load('seasonal_scenes'),
  GEOLOGICAL_SCENES: load('geological_scenes'),
  MICRO_NATURE: load('micro_nature'),
  DEEP_FOREST_SCENES: load('deep_forest_scenes'),
  LUSH_JUNGLE_SCENES: load('lush_jungle_scenes'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  NATIONAL_PARKS: load('national_parks'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  // Sensory anchor pools — 1 context (scene) × 7 channels × 100 entries.
  SENSORY_POOLS: {
    scene: {
      smell: load('sensory_scene_smell'),
      sound: load('sensory_scene_sound'),
      touch: load('sensory_scene_touch'),
      temperature: load('sensory_scene_temperature'),
      weight: load('sensory_scene_weight'),
      air: load('sensory_scene_air'),
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
