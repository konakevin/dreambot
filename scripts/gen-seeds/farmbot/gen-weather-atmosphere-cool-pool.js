#!/usr/bin/env node
/**
 * FarmBot — weather_atmosphere pool, COOL-HUE REBALANCE (2026-09-09).
 *
 * Kevin: a review of the whole render grid showed a strong, consistent
 * golden/amber wash across nearly every render. Root cause was two-fold —
 * FARMBOT_COZY_NEUTRAL used to hard-lock "the palette stays warm" on every
 * render (fixed, see shared-blocks.js) AND this pool itself skewed 14/25
 * warm-dominant vs. 5/25 cool. This is the second half of the fix: append
 * genuinely cool/neutral-hued atmosphere entries (blues, greens, violets,
 * silvery greys) so a rendered scene has real hue variety to draw from,
 * not just more warm entries relabeled. Gentle/cozy still applies — cool
 * ≠ bleak or harsh, same "never storms/harsh weather" rule as the base pool.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_weather_atmosphere.json'),
    total: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WEATHER/ATMOSPHERE descriptions for a cozy
countryside bot — light and air quality as an emotional modifier. This batch is specifically
for COOL and NEUTRAL hues — the pool already has plenty of warm golden/amber entries, so
every single entry here must lean blue, green, violet, silver, or grey in its light and color
language. Draw from: a cool blue-grey overcast morning, silvery moonlight, a misty violet dusk,
cool fog settling over pastures, pale winter light on snow, a lavender-blue dawn just before
sunrise, dappled green forest-adjacent light, a teal-tinted dusk, cool rain-washed air, a
crisp blue autumn sky, morning dew under pale silver light, a cool green shade under a big
tree, soft grey drizzle-light through a window.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — pick "spring", "summer", "autumn", or "winter" if the entry is season-specific, or
"ANY" if it could suit any season.

Examples:
[{"tags": ["ANY"], "description": "Cool blue-grey light spreading evenly under a soft overcast sky, everything hushed and gentle."}, {"tags": ["winter"], "description": "Pale silvery light on fresh snow, the whole world washed in cool quiet blue."}, {"tags": ["autumn"], "description": "A crisp, clear blue autumn sky stretching wide overhead, the air cool and clean."}]

🚫 STRICT BANS: NO storms/harsh weather/bleak or gloomy skies (cool is fine, bleak is not), NO
warm/golden/amber/honey color words anywhere in these entries, NO readable text, NO brand
names, NO photographer/camera-brand names, NO named people.

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
