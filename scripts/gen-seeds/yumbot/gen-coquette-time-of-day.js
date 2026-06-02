#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_time_of_day.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TIME-OF-DAY descriptors for a kawaii coquette food-party scene. PURE time of day.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY. Time-of-day color must stay in this palette range.

Each entry: 10-16 words. NAMES the time + brief color-temperature note.

Distribution:
- 24% AFTERNOON TEA (5-6) — warm pink-tinged afternoon-tea light
- 20% PINK GOLDEN HOUR (5) — warm pink-rose sunset glow
- 16% MORNING DAINTY (4) — soft pearl-pink dawn light
- 14% PINK TWILIGHT (3-4) — soft pink-lavender twilight
- 10% LATE MORNING (3) — bright pink-cream late-morning light
- 8% AFTERNOON SUNNY (2-3) — bright pastel pink-tinged afternoon
- 8% BLUE HOUR LAVENDER (2) — soft cool lavender dusk

DO write:
"Warm afternoon-tea pink-cream light pooling across the tabletop"
"Pink-rose golden hour bathing the scene in warm-pink glow"
"Soft pearl-pink dawn light catching dew on the petals"
"Pink-lavender twilight settling over the coquette boudoir"

DO NOT write:
- Lighting direction (separate axis)
- Weather descriptors
- Any time-of-day color outside the pink/lavender/white/soft-purple palette

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
