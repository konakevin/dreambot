#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot fruits-and-veggies renders.

Each entry: 10-18 words. ONE specific time window.

━━━ DISTRIBUTION ━━━

- 5 EARLY MORNING (5-8am, dew on garden, market opening)
- 5 MID-MORNING (8-11am, sunny garden tending, fresh harvest)
- 4 EARLY AFTERNOON (1-3pm, sunny orchard / market peak)
- 5 LATE AFTERNOON / GOLDEN HOUR (3-6pm, harvest glow)
- 3 EARLY EVENING (6-8pm, dusk garden / closing market)
- 3 FOREST-MAGIC HOUR (sunset filtering / dawn filtering through canopy)

━━━ EXAMPLES ━━━

"Early morning around 6am, soft pink-cream sky with garden dew sparkling"
"Mid-morning around 10am, clear bright awake light flooding the garden evenly"
"Early afternoon around 2pm, high-sun overhead with crisp warm orchard shadows"
"Golden hour around 5pm, long warm shadows and amber rim-light across harvest"
"Early evening around 7pm, dusk garden cooling with first warm tones from the west"
"Forest magic-hour around 4pm, deep filtered shafts of light slanting through the canopy"

━━━ HARD BANS ━━━

- NO weather
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
