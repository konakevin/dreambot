#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot carnival-food renders.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 4 MID-MORNING (carnival opens, fresh setup)
- 4 EARLY AFTERNOON (1-3pm, peak fair-going hours)
- 5 LATE AFTERNOON / GOLDEN HOUR (3-6pm, magic hour)
- 4 EARLY EVENING (6-8pm, dusk transition)
- 5 BLUE-HOUR / DUSK (string-lights coming alive)
- 3 CARNIVAL NIGHT (10pm, fully-lit midway)

━━━ EXAMPLES ━━━

"Mid-morning around 10am, clear bright awake light flooding the midway"
"Early afternoon around 2pm, high-sun fair-going hour with crisp warm shadows"
"Golden hour around 5pm, long warm shadows and amber rim across the fairground"
"Early evening around 7pm, dusk sky cooling with first string-lights coming on"
"Blue-hour around 8pm, cooling sky with all string-lights blazing warm"
"Carnival night around 10pm, deep dark with bright midway lights blazing"

━━━ HARD BANS ━━━

- NO weather
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
