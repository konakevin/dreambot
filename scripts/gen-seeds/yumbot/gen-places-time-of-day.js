#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot unexpected-places renders.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 4 EARLY MORNING (5-8am, soft pre-opening light)
- 4 MID-MORNING (8-11am, clear bright awake)
- 4 EARLY AFTERNOON (1-3pm, high-sun)
- 5 LATE AFTERNOON / GOLDEN HOUR (3-6pm, long warm shadows)
- 4 EARLY EVENING (6-8pm, dusk transition, carnival-coded)
- 4 LATE NIGHT (10pm-1am, library / aquarium quiet hour)

━━━ EXAMPLES ━━━

"Early morning around 6am, soft pink-cream sky barely brightening"
"Mid-morning around 10am, clear bright awake light flooding evenly"
"Early afternoon around 2pm, high-sun with crisp warm shadows"
"Golden hour around 5pm, long warm shadows and amber rim-light"
"Early evening around 7pm, dusk sky cooling with first lights coming on"
"Late night around 11pm, deep dark with warm interior glow"

━━━ HARD BANS ━━━

- NO weather
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
