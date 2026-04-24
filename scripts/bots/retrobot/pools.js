/**
 * RetroBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/retrobot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const ERA_PALETTES = {
  cozy: 'warm wood-paneled amber, incandescent bulb glow, brown and orange shag tones',
  peaceful: 'soft pastel morning light through sheer curtains, robin-egg blue, faded cream',
  whimsical: 'neon arcade pink and teal, laser-tag purple, slap-bracelet yellow',
  enchanted: 'Christmas-light multicolor glow, sparkling tinsel silver, warm velvet red',
  nostalgic: 'Kodachrome warm, sun-bleached Polaroid, golden-hour amber through dusty blinds',
  ethereal: 'VHS tracking-line blue, CRT phosphor green, soft TV glow in dark room',
  cinematic: 'Spielberg golden backlight, suburban dusk orange-to-purple, headlight flare',
  surreal: 'day-glo Lisa Frank rainbow, Trapper Keeper holographic, blacklight poster purple',
  shimmer: 'chrome bumper reflection, disco ball scatter, metallic-flake paint sparkle',
  coquette: 'dusty rose wallpaper, soft peach lamplight, powder-blue bedroom walls',
};

module.exports = {
  SATURDAY_MORNING: load('saturday_morning'),
  MALL_HANGOUT: load('mall_hangout'),
  VIDEO_STORE: load('video_store'),
  SUMMER_GOLDEN: load('summer_golden'),
  BEDROOM_TIME_CAPSULE: load('bedroom_time_capsule'),
  HOLIDAY_SEASONS: load('holiday_seasons'),
  ROAD_TRIP: load('road_trip'),
  SLEEPOVER_NIGHT: load('sleepover_night'),
  RETRO_TECH: load('retro_tech'),
  SENSORY_TEXTURES: load('sensory_textures'),
  LIGHTING: load('lighting'),
  ERA_PALETTES,
};
