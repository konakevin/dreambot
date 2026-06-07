#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot scale-twist renders. Each entry names a specific hour-window with atmospheric quality, tuned for epic-vista scale scenes.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 4 EARLY MORNING (5-8am, golden first-light over island / city)
- 4 MID-MORNING (8-11am, bright awake light)
- 4 EARLY AFTERNOON (1-3pm, high-sun)
- 5 LATE AFTERNOON / GOLDEN HOUR (3-6pm, long warm shadows, epic vista hour)
- 3 EARLY EVENING / DUSK (6-8pm, blue-hour, dramatic city)
- 5 COSMIC NIGHT / DEEP NIGHT (vast star-field, cosmic-coded / midnight chocolate-river)

━━━ EXAMPLES ━━━

"Early morning around 6am, soft pink-orange sky brightening over the vista"
"Mid-morning around 10am, clear bright awake light flooding the scene"
"Early afternoon around 2pm, high-sun overhead with crisp warm shadows"
"Golden hour around 5pm, long warm shadows and amber rim-light across vast vista"
"Dusk around 7pm, blue-hour cooling sky with first city lights coming on"
"Deep cosmic night, vast starfield with nebula glow surrounding the scene"

━━━ HARD BANS ━━━

- NO weather
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
