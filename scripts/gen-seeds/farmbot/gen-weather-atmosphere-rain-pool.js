#!/usr/bin/env node
/**
 * FarmBot — weather_atmosphere pool, RAIN EXPANSION (2026-09-09).
 *
 * Kevin: "we want lots of rainy weather in this too" — part of the same
 * hue-freedom push (rain is naturally cool/blue-grey-toned, and gives paths
 * like rainy-farmhouse-morning genuine variety instead of reaching for the
 * same 1-2 rain entries every time). Gentle, cozy rain only — never a storm
 * or downpour, same "never harsh weather" rule as the rest of this pool.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_weather_atmosphere.json'),
    total: 55,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WEATHER/ATMOSPHERE descriptions for a cozy
countryside bot, ALL of them variations on GENTLE RAIN — never a storm or downpour, always
cozy and soft. Cover a wide range of rain moods and details: rain pattering softly on a tin
roof, rain streaking down a windowpane, a light drizzle over the fields, rain on flower
petals, puddles rippling in a gentle shower, distant thunder that never gets close, rain
easing into a fine mist, the fresh clean smell right after rain stops, raindrops trembling on
a spiderweb, a rainbow appearing as the clouds break, steam rising off warm stones after rain,
rain-soaked cobblestones reflecting soft light, a light rain falling through golden late
sun (a "sun shower").

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — pick "spring", "summer", "autumn", or "winter" if the entry is season-specific, or
"ANY" if it could suit any season.

Examples:
[{"tags": ["ANY"], "description": "Rain pattering softly on a tin roof, a steady gentle rhythm filling the quiet air."}, {"tags": ["spring"], "description": "A light spring drizzle beading on new leaves, everything fresh and impossibly green."}, {"tags": ["ANY"], "description": "The clean, mineral-sweet smell of earth right after the rain has stopped, everything glistening."}]

🚫 STRICT BANS: NO storms/downpours/lightning strikes/harsh weather, NO readable text, NO
brand names, NO photographer/camera-brand names, NO named people.

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
