#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_time_of_day.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot cozy-landscape — short cinematic time/light descriptors that fix WHEN this cozy world is rendered. Path covers full day + cozy-evening + dawn (NOT deep-night specifically — that's night-meadow path).

Each entry: 8-15 words. ONE time-of-day moment with signature sky color + ambient light quality.

━━━ DISTRIBUTION ━━━

Cover the COZY-LANDSCAPE day-cycle (mostly daytime + golden + dusk + cozy-evening):
- 20% golden-hour (sunset, late afternoon, peach-amber low-angle sun, long shadows)
- 20% midday-bright (clear-blue sky overhead, bright direct sun, peak afternoon glow)
- 15% blue-hour twilight (just-after-sunset, sky still lit purple-orange, first stars)
- 15% dawn (predawn pearl-grey, first-pink horizon, dew-glinting morning)
- 10% candlelit / lamplit evening (warm interior light pouring out of windows at night, hearth glow, paper-lantern halo)
- 10% overcast / soft-grey daylight (cloud-diffused, even soft light, cozy-rainy-day mood)
- 5% special-light (rainbow-after-rain / sunrise-with-mist / sun-pillar / aurora-faint / first-snow-light)
- 5% moonlit / late-evening (silvery-blue moonlight, cool soft, twilight transitioning to night)

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Concrete time anchor + signature color cast + ONE specific light-quality detail
- Reads as a moment, not generic

━━━ HARD BANS ━━━

- NO deep-night (that's night-meadow)
- NO weather (no "rainy" / "snowy" — separate axis)
- NO setting language
- NO creatures or activity
- NO repeated openers

━━━ DEDUP ━━━

Dedup by time + color cast + light detail.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
