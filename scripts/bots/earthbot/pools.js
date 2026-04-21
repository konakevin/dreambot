/**
 * EarthBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/earthbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// VIBE_COLOR keyed to allowed vibes
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, dramatic highlights, deep shadows',
  dark: 'deep moody charcoal and slate, stormy grey, low-key dramatic contrast',
  cozy: 'warm amber sunlight, soft golden glow, inviting earthtones',
  epic: 'dramatic god rays, rich golden highlights, deep blue shadows, heroic scale',
  nostalgic: 'warm copper and sepia, faded pastels, soft film-grain palette',
  peaceful: 'soft diffuse daylight, gentle pastels, breath-worthy calm',
  whimsical: 'playful saturated pastels, warm creamy light, buoyant atmosphere',
  ethereal: 'pearl-white mist, opalescent haze, luminous pale tones',
  arcane: 'deep violet and emerald sky, mystic twilight palette, runic shadows',
  ancient: 'molten amber sunbeams, bronze patina, weathered earth tones',
  enchanted: 'soft magical glow, gentle highlights, dreamy luminescence',
  fierce: 'harsh contrast, stark amber and obsidian, volcanic-red sky, savage palette',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  voltage: 'electric blue storm-arcs, neon lightning accents, high-contrast sky',
  nightshade: 'deep violet and silver moonlight, gentle plum tones, starlit',
  shimmer: 'shimmering gold particles, iridescent highlights, glistening surfaces',
  surreal: 'impossible color pairings, hallucinatory saturation shifts, dreamlike contrast',
};

module.exports = {
  EARTH_VISTAS: load('earth_vistas'),
  HIDDEN_EARTH_CORNERS: load('hidden_earth_corners'),
  EARTH_WEATHER_PHENOMENA: load('earth_weather_phenomena'),
  COZY_EARTH_SCENES: load('cozy_earth_scenes'),
  SKY_PHENOMENA: load('sky_phenomena'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  TIME_OF_DAY: load('time_of_day'),
  BIOMES: load('biomes'),
  VIBE_COLOR,
};
