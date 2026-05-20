#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot cozy-interior — warm-amber-lit indoor times. Interior is always warm + amber + cozy.

Each entry: 8-15 words.

━━━ DISTRIBUTION ━━━

- 25% GOLDEN-HOUR (warm peach-amber late-afternoon sun pouring through windows / honey-gold low-angle sun across the floorboards / sleepy 4pm slant of warm light)
- 20% CANDLELIT EVENING (warm-amber candlelit twilight indoors / lamplit cozy evening / fireplace-glow at deep evening / brass-lantern golden pool)
- 15% NOON-FILTERED (warm midday sun through gauzy curtains / lazy bright-but-soft afternoon / peak-warm-day diffuse through panes)
- 15% MORNING (early-morning amber light slanting in / pearl-grey dawn with first lamp lit / golden hour breakfast light)
- 10% BLUE-HOUR (gentle blue-hour with warm interior glow contrasted / lavender pre-twilight with first amber lights on / cool twilight outside vs warm-amber inside)
- 10% RAINY-OVERCAST (cozy grey-overcast outside contrasting with warm interior / dim soft daylight with warm lamp on / drizzly afternoon with shelter-warm contrast)
- 5% MAGICAL-TIME (rainbow-after-rain visible through window / golden god-rays piercing through clouds onto the room / aurora-faint outside the window)

━━━ HARD BANS ━━━

- NO bright direct noon
- NO setting / creature / activity

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
