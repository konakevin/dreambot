#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_time_of_day.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot rainy-day-cozy — when this cozy-rain-shelter moment is happening. The shelter is warm-cozy inside; the exterior is cool-blue-grey from rain. The time-of-day shapes both ambient quality.

Each entry: 8-15 words.

━━━ DISTRIBUTION ━━━

- 25% overcast afternoon (steady grey afternoon rain with diffuse cool blue-grey ambient / dreary mid-afternoon rain with even soft light / drizzly afternoon with cool flat ambience)
- 20% blue-hour twilight (early-dusk blue-hour rain with warm-amber shelter glow vs indigo wet world / late-twilight with shelter lit warm)
- 20% candlelit / lamplit evening (warm-amber shelter at night with rain in the dark beyond / lamplit porch at deep evening with rain visible in the darkness)
- 15% rainy morning (pearl-grey morning rain with shelter still warm-amber / pre-dawn rain with the first light through clouds / drizzly morning with golden interior glow)
- 10% golden-break-in-clouds (a single warm-amber sun-pillar breaking through the rain clouds and lighting the shelter / brief gilded light between storm passes)
- 5% magical-time (rainbow-after-rain moment forming visible from the shelter / golden mist after a brief shower / steam-rising-from-warm-stones / aurora-faintly-visible-through-rain)
- 5% deep-evening / late-night (deep evening rain with only the lanterns lit / late-evening with rain drumming the shelter roof)

━━━ HARD BANS ━━━

- NO bright sunny midday (rainy baseline)
- NO setting / shelter language
- NO creatures or activity

━━━ DEDUP ━━━

Dedup by time + ambient quality + signature detail.

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
