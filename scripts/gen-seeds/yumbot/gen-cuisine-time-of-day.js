#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_time_of_day.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptors for YumBot cuisine renders. Each entry names a specific hour-window with atmospheric quality, tuned for cuisine settings (morning bakery, lunch trattoria, afternoon mithai, evening souk, etc.).

Each entry: 10-18 words. ONE specific time window with atmospheric quality.

━━━ DISTRIBUTION ━━━

- 5 EARLY MORNING (5-8am, pre-opening bakery hours)
- 5 MID-MORNING (8-11am, fresh patisserie / brunch cafe)
- 4 EARLY AFTERNOON (1-3pm, lunch trattoria / mercado)
- 4 LATE AFTERNOON / GOLDEN HOUR (3-6pm, mithai-shop / patisserie tea-time)
- 4 EARLY EVENING (6-8pm, neon Korean dessert cafe / souk evening)
- 3 STAGE-NIGHT (8-11pm, lantern-lit souk / brass-lit mithai late)

━━━ EXAMPLES ━━━

"Early morning around 6am, gentle pre-opening bakery glow with soft pink-cream sky"
"Mid-morning around 10am, clear bright awake light flooding evenly through cafe windows"
"Early afternoon around 2pm, high-sun lunch hour with crisp warm shadows on the counter"
"Golden hour around 5pm, long warm shadows and amber rim-light glazing the display"
"Early evening around 7pm, dusk sky cooling with first warm lanterns turning on"
"Lantern-night around 9pm, deep dark surround with brass lanterns blazing softly"

━━━ HARD BANS ━━━

- NO weather (folded into lighting axis)
- NO subject/scene language
- NO color-palette names

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
