#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_time_of_day.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot sleepy-naptime — drowsy/peaceful times when an adorable creature would nap. Warm + golden + soft + drowsy ambient.

Each entry: 8-15 words.

━━━ DISTRIBUTION ━━━

- 25% golden-hour afternoon (warm peach-amber late-afternoon sun pooling in / honey-gold low-angle sun softening every shape / sleepy 4pm slant of warm light)
- 20% candlelit evening (warm candlelit twilight / lamp-glow at dusk casting amber pool / soft hearth-glow lulling everything to sleep)
- 15% noon-warm / midday-drowsy (warm midday sun through gauzy curtains / lazy bright-but-soft afternoon / peak-warm-day with diffuse light)
- 15% blue-hour / pre-twilight (gentle blue-hour with first amber lights kicking on / lavender pre-twilight wrapping the room in soft cool)
- 10% moonlit / soft-night (silvery moonlit window-light / soft moonbeam on the sleeping pose / starlight-only with single nightlight)
- 10% pre-dawn (peaceful pearl-grey pre-dawn / first golden hint just creeping in / quiet dawn-blue with sleeper still curled)
- 5% magical-time (sunset-and-rainbow-simultaneously / amber-gold-cloud-light / aurora-faint at dusk)

━━━ HARD BANS ━━━

- NO bright loud noon
- NO stormy
- NO setting/creature/activity

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
