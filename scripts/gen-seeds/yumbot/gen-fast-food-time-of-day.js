#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot fast-food renders.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 4 MID-MORNING (10-11am, breakfast-burger / brunch hours)
- 5 LUNCH HOUR (11am-2pm, peak fast-food lunch)
- 4 EARLY AFTERNOON (2-4pm, afternoon snack)
- 4 LATE AFTERNOON / GOLDEN HOUR (4-6pm)
- 4 EARLY EVENING / DUSK (6-8pm, dinner rush)
- 4 LATE NIGHT (10pm-1am, late-night diner / drive-thru)

━━━ EXAMPLES ━━━

"Mid-morning around 10am, clear bright awake light flooding evenly"
"Lunch hour around 1pm, high-sun lunch-rush light with crisp warm shadows"
"Early afternoon around 3pm, warm bright snack-hour light"
"Golden hour around 5pm, long warm shadows and amber rim-light"
"Early evening around 7pm, dusk dinner-rush sky cooling with first lights coming on"
"Late night around 11pm, deep dark with warm interior glow"

━━━ HARD BANS ━━━

- NO weather
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
