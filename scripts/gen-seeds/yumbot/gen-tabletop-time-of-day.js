#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_time_of_day.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY descriptors for a kawaii checkered-tabletop scene. PURE time of day.

Each entry: 10-16 words. NAMES the time + brief color-temperature note.

Distribution:
- 22% LATE MORNING (5) — bright warm late-morning light
- 18% AFTERNOON TEA (4-5) — warm afternoon tea-time light
- 16% GOLDEN HOUR (3-4) — warm peach-amber sunset / sunrise honey-glow
- 14% MORNING DEWY (3-4) — soft pearly dawn light
- 10% LUNCH HOUR (2-3) — bright midday warm sun-glow
- 8% EVENING DINNER (2) — warm dusky evening lantern-light
- 6% TWILIGHT (2) — soft pastel twilight transitioning
- 6% BREAKFAST (2) — soft pearly morning light

DO write:
"Late morning warm-bright light spilling across the tabletop"
"Afternoon tea-time warm-amber light pooling across the gingham"
"Golden-hour honey-amber light bathing the scene in warm glow"
"Soft pearly dawn light catching dew on the petals"
"Bright pastel midday warm light on the spread"

DO NOT write:
- Lighting direction (separate axis)
- Weather descriptors (separate axis)
- Setting / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
