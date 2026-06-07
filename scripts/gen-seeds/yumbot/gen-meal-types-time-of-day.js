#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot meal-types renders. Each entry names a specific hour-window with its atmospheric feel — what the light + sky + ambient mood are doing at that time. Distributed across the 6 meal-types contexts.

Each entry: 10-18 words. ONE specific time-of-day window with atmospheric quality.

━━━ DISTRIBUTION ━━━

- 5 EARLY MORNING (5-8am, soft pre-sunrise to first warm rays, breakfast hours)
- 4 MID-MORNING (8-11am, bright clear awake light, breakfast / brunch)
- 4 EARLY AFTERNOON (1-3pm, bright high-sun, lunch and picnic and tea-time)
- 4 LATE AFTERNOON / GOLDEN HOUR (3-6pm, long warm shadows, tea-time and casual)
- 4 EARLY EVENING / DUSK (6-8pm, blue-hour cooling, food-truck and dinner)
- 4 LATE NIGHT (10pm-1am, deep dark with warm interior pools, midnight-snack hours)

━━━ EXAMPLES ━━━

"Soft pre-sunrise around 6am, gentle pink-and-cream sky barely brightening through curtains"
"Mid-morning around 10am, clear bright awake light flooding the room evenly"
"Early afternoon around 2pm, bright high-sun overhead with warm crisp shadows"
"Golden hour around 5pm, long warm shadows and amber rim-light catching every surface"
"Blue-hour dusk around 7pm, cooling sky with first neon signs starting to glow"
"Late night around 11pm, deep dark with one warm interior lamp puddle anchoring the scene"

━━━ HARD BANS ━━━

- NO weather inside the entry (weather is folded into lighting axis)
- NO subject/scene language
- NO color-palette names (palette is its own axis — name SKY tones inside time-of-day instead of decor)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
