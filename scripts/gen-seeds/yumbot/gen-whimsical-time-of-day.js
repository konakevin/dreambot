#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot whimsical-concept renders. Each entry names a specific hour-window with atmospheric feel.

Each entry: 10-18 words. ONE specific time window with atmospheric quality.

━━━ DISTRIBUTION ━━━

- 5 EARLY MORNING (5-8am, soft cozy first-light)
- 5 MID-MORNING (8-11am, clear awake light, classroom-coded)
- 4 EARLY AFTERNOON (1-3pm, bright high-sun, energetic)
- 4 LATE AFTERNOON / GOLDEN HOUR (3-6pm, long warm shadows)
- 4 EARLY EVENING (6-8pm, dusk transition, runway-coded)
- 3 STAGE-NIGHT (8-11pm, theater-hour, orchestra and stage-show coded)

━━━ EXAMPLES ━━━

"Early morning around 7am, soft pink-cream sky just brightening"
"Mid-morning around 10am, clear bright awake light flooding evenly"
"Early afternoon around 2pm, high-sun overhead with crisp warm shadows"
"Golden hour around 5pm, long warm shadows and amber rim-light"
"Early evening around 7pm, dusk sky cooling with first warm lights coming on"
"Stage-night around 9pm, deep dark surround with stage lights blazing"

━━━ HARD BANS ━━━

- NO weather (weather folded into lighting axis)
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
