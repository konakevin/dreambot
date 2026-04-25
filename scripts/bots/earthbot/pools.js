const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, deep atmospheric shadows',
  cozy: 'warm amber golden-hour glow, honey light through canopy',
  dark: 'deep moody storm-light, rich shadows with single bright break',
  epic: 'dramatic god-rays through clouds, heroic golden scale',
  nostalgic: 'faded warm copper tones, golden-age film palette',
  peaceful: 'soft pastel dawn wash, gentle diffuse luminosity',
  ethereal: 'soft golden-hour glow, luminous pastel sky, dreamlike clarity',
  ancient: 'weathered bronze patina, deep-umber earth tones',
  enchanted: 'soft magical inner-glow, dreamy luminous atmosphere',
  voltage: 'electric-blue lightning energy, storm-charged palette',
  nightshade: 'deep violet moonlit landscape, silver-blue shadows',
  shimmer: 'shimmering gold-amber light, iridescent surface reflections',
  surreal: 'impossible color pairings, dreamy chromatic shifts',
};

module.exports = {
  EPIC_VISTAS: load('epic_vistas'),
  WEATHER_PHENOMENA: load('weather_phenomena'),
  HIDDEN_CORNERS: load('hidden_corners'),
  SKY_PHENOMENA: load('sky_phenomena'),
  LUMINOUS_SCENES: load('luminous_scenes'),
  BIOLUMINESCENT_SCENES: load('bioluminescent_scenes'),
  SACRED_LIGHT_MOMENTS: load('sacred_light_moments'),
  ENCHANTED_SCENES: load('enchanted_scenes'),
  UNDERWATER_SCENES: load('underwater_scenes'),
  SEASONAL_SCENES: load('seasonal_scenes'),
  GEOLOGICAL_SCENES: load('geological_scenes'),
  MICRO_NATURE: load('micro_nature'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  NATIONAL_PARKS: load('national_parks'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
