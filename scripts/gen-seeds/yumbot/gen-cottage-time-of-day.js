#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_time_of_day.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY descriptors for a kawaii cottagecore-nature scene. PURE time of day.

Each entry: 10-16 words. NAMES the time + brief color-temperature note.

Distribution:
- 25% GOLDEN HOUR (6-7) — warm peach-amber sunset / sunrise honey-glow
- 20% LATE AFTERNOON (5) — bright pastel-warm pre-sunset light
- 18% MORNING DEWY (4-5) — soft pearly dawn light with dewdrops still on grass
- 14% MIDDAY (3-4) — bright pastel sunny midday
- 8% TWILIGHT (2) — soft pastel twilight transitioning to dusk
- 8% BLUE HOUR (2) — soft cool periwinkle dusk just before night
- 7% SUNNY AFTERNOON (2) — bright warm afternoon at the meadow

DO write:
"Golden-hour honey-amber sunset bathing the cottage in warm glow"
"Soft pearly morning with dewdrops glistening on grass blades"
"Bright pastel sunny midday across the wildflower meadow"
"Soft pastel twilight settling over the cottage garden in lavender"
"Warm late-afternoon glow pooling across the picnic blanket"

DO NOT write:
- Lighting direction (separate axis)
- Weather descriptors (separate axis)
- Setting / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
