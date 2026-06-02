#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_time_of_day.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIMES-OF-DAY for YumBot's candy-fantasy Sugar Rush world. PURE time descriptors — what time of day the scene takes place.

Each entry: 10-16 words. NAMES THE TIME OF DAY + brief color-temperature note. NO lighting direction (separate axis). NO weather (separate axis).

━━━ DISTRIBUTION ━━━

- 20% GOLDEN HOUR (6) — warm late-afternoon sun about an hour before sunset, honey-amber color temperature
- 15% MIDDAY (5) — bright high-noon Disney-CGI saturated daylight, neutral warm temperature
- 14% TWILIGHT MAGIC-HOUR (4) — just after sunset, sky transitioning through pink/violet/blue gradients
- 14% DAWN EARLY-MORNING (4) — soft pastel light just after sunrise, pearly cool-warm tones
- 12% AFTERNOON (4) — bright pastel afternoon glow, vivid saturated daytime
- 10% SUNSET (3) — peach-and-rose orange-pink dropping toward horizon, dramatic warm gradient
- 7% BLUE-HOUR (2) — soft cool-blue dusk just before night, pastel periwinkle and lavender sky
- 8% STARLIT NIGHT (2) — soft moonlit night with pop-rock stars in sky, deep navy with pastel constellations

━━━ HARD MANDATES ━━━

- ONLY TIME-OF-DAY described — no light direction, no weather, no environment
- Disney-CGI saturated lush pastel color palette throughout
- Sugar Rush register

━━━ HARD BANS ━━━

- NO light DIRECTION (rim-light / backlit / volumetric — those are in lighting axis)
- NO weather (rain / mist / snow — that's in weather axis)
- NO environment description (mountains / trees / characters)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
