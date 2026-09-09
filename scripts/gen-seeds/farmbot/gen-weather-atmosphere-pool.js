#!/usr/bin/env node
/**
 * FarmBot — weather_atmosphere shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md section 11).
 * Light/air quality as an emotional modifier, plus floating atmospheric
 * detail. Weather here is always cozy — never harsh or bleak.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_weather_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WEATHER/ATMOSPHERE descriptions for a cozy
countryside bot — light and air quality as an emotional modifier. Draw from: warm morning
sunlight, golden late-afternoon light, sunset glow, blue hour, a starry night, gentle rain,
misty morning, soft snowfall, summer haze, crisp autumn air — plus floating atmospheric detail:
fireflies, sunbeams, floating pollen, falling petals, falling leaves, dew, golden dust motes,
steam from something warm nearby.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — pick "spring", "summer", "autumn", or "winter" if the entry is season-specific, or
"ANY" if it could suit any season.

Examples:
[{"tags": ["ANY"], "description": "Golden late-afternoon light slanting low across the grass, warm and unhurried."}, {"tags": ["summer"], "description": "Fireflies just beginning to blink on as the sky turns violet at the edges."}]

🚫 STRICT BANS: NO storms/harsh weather/bleak grey skies, NO readable text, NO brand names, NO
photographer/camera-brand names, NO named people.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
