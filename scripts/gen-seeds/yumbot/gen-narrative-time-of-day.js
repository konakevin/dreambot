#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot narrative-action renders.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 5 EARLY MORNING (5-8am, pre-bake / dawn-harvest hours)
- 5 MID-MORNING (8-11am, breakfast bakery / harvest gather)
- 4 EARLY AFTERNOON (1-3pm, midday parade / delivery)
- 5 LATE AFTERNOON / GOLDEN HOUR (3-6pm, tea-party hour)
- 3 EARLY EVENING (6-8pm, dusk parade / tea-light delivery)
- 3 LATE NIGHT (10pm-1am, secret-bake / midnight delivery)

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
