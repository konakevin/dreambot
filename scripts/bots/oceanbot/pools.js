/**
 * OceanBot — pool registry. Maps pool-name strings to seed JSON arrays.
 *
 * load() is resilient (try/catch ENOENT → []) so the module loads even
 * when seed files are still being generated. Returns [] for missing
 * pools instead of crashing — the composer surfaces the gap via
 * pool-name resolution failure with a clear error.
 *
 * 10 paths × ~10-11 axes each = ~100 path-bespoke pools. Plus shared:
 *   LIGHTING + ATMOSPHERES + SCENE_PALETTES — universal slots
 *   VIBE_COLOR — vibe → palette string lookup (static, not seed-driven)
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Vibe → color palette string (deterministic from rolled vibe — not a seed pool).
// Ocean-coded vibes only; matches the 10 vibes declared on the bot.
const VIBE_COLOR = {
  cinematic: 'cinematic ocean palette, teal-and-orange depth, saturated contrast',
  dark: 'inky abyssal blacks, deep navy shadow, storm-cloud chiaroscuro',
  peaceful: 'silvered dawn palette, soft pastel sea, dawn-mist tranquility',
  epic: 'dramatic god-ray palette, heroic sunset over swell, painterly saturation',
  nostalgic: 'faded-postcard ocean palette, copper sunset, sepia-tinted age-of-sail',
  ethereal: 'opalescent sea palette, pearl-white luminance, soft glow',
  ancient: 'weathered-bronze patina, verdigris-on-stone, age-of-empire faded color',
  enchanted: 'soft magical glow, dreamy aqua-and-rose shimmer',
  voltage: 'lightning-blue electric arcs, storm-cyan, cold cosmic accents',
  nightshade: 'deep violet moonlight, plum sea shadow, twilight silvers',
};

module.exports = {
  // ── Shared / universal pools ──
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),

  VIBE_COLOR,

  // ── shipwreck-kingdom path-bespoke pools (pilot path — wired before
  // ── any seed files exist; loads as [] until gen-oceanbot-pool.js
  // ── populates them) ──
  SHIPWRECK_KINGDOM_WRECK_CLASS: load('shipwreck_kingdom_wreck_class'),
  SHIPWRECK_KINGDOM_DECAY_STATE: load('shipwreck_kingdom_decay_state'),
  SHIPWRECK_KINGDOM_CORAL_GROWTH: load('shipwreck_kingdom_coral_growth'),
  SHIPWRECK_KINGDOM_MARINE_LIFE: load('shipwreck_kingdom_marine_life'),
  SHIPWRECK_KINGDOM_CAUSTIC_LIGHT: load('shipwreck_kingdom_caustic_light'),
  SHIPWRECK_KINGDOM_WATER_CLARITY: load('shipwreck_kingdom_water_clarity'),
  SHIPWRECK_KINGDOM_FOREGROUND_ELEMENT: load('shipwreck_kingdom_foreground_element'),
  SHIPWRECK_KINGDOM_SCALE_PROVERS: load('shipwreck_kingdom_scale_provers'),
  SHIPWRECK_KINGDOM_CAMERA_FRAMING: load('shipwreck_kingdom_camera_framing'),
  SHIPWRECK_KINGDOM_SURPRISE_ELEMENT: load('shipwreck_kingdom_surprise_element'),
  SHIPWRECK_KINGDOM_DRAMA: load('shipwreck_kingdom_drama'),

  // (Other 9 paths' pools added when their gen-scripts ship.)
};
