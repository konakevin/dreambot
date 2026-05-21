#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_time_of_day.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY descriptors for a kawaii mini-chef kitchen scene. PURE time of day — when in the day this kitchen scene takes place.

Each entry: 10-16 words. NAMES the time + brief color-temperature note.

Distribution:
- 22% EARLY MORNING BAKERY (5-6) — soft pearly dawn light, just-baking-bread golden warmth
- 18% LATE MORNING (4-5) — bright pastel-warm late-morning kitchen light
- 16% AFTERNOON (4) — bright pastel afternoon glow through window
- 14% GOLDEN HOUR (3-4) — warm peach-amber sunset coming through kitchen window
- 12% LUNCH HOUR (3) — bright midday sun pouring across the counter
- 8% EVENING DINNER PREP (2) — warm dusky evening as chefs prep dinner
- 6% TWILIGHT (2) — soft pastel twilight with kitchen-lights warmly on
- 4% NIGHT BAKERY (1) — late-night warm kitchen-lantern glow with darkness outside

DO write:
"Early morning bakery, pearly dawn light through the window, just-baked bread warmth"
"Golden-hour late-afternoon, peach-amber sunset spilling across the kitchen counter"
"Bright pastel afternoon kitchen-light pouring warmly across the prep surface"

DO NOT write:
- Light DIRECTION (separate axis)
- Weather (separate axis)
- Setting / character / activity descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
