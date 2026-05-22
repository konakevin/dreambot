#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_time_of_day.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY descriptors for a kawaii Japanese koi-pond scene. PURE time of day. Heavy emphasis on twilight / dusk / evening — the bex.ai reference aesthetic register.

Each entry: 10-16 words. NAMES the time + brief color-temperature note.

Distribution:
- 28% TWILIGHT MAGIC-HOUR (7) — pink-violet-blue twilight, the signature register
- 22% PINK GOLDEN HOUR (5-6) — warm pink-rose sunset glow
- 16% BLUE HOUR DUSK (4) — soft cool periwinkle dusk just before night
- 12% STARRY NIGHT (3) — soft moonlit pond, lantern-glow accent
- 10% LATE AFTERNOON (3) — warm pastel afternoon light
- 6% MOONLIT EVENING (2) — full moon over the pond
- 6% EARLY MORNING DEWY (2) — soft pearly dawn light

DO write:
"Warm twilight magic-hour, sky transitioning from peach to violet to blue"
"Soft blue hour dusk, lanterns just lit, pond reflecting periwinkle"
"Pink golden hour bathing the pond in warm-rose glow"
"Starry indigo summer night with paper-lanterns glowing warm against the dark sky"
"Pastel late afternoon glow on the pond water"

DO NOT write:
- Light DIRECTION (separate axis)
- Weather (separate axis)
- Setting / character description

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
