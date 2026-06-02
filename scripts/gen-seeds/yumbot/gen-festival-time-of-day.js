#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_time_of_day.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TIME-OF-DAY descriptors for a kawaii Japanese matsuri scene. PURE time of day — what time of day the festival is happening.

Each entry: 10-16 words. NAMES the time of day + brief color-temperature note. NO lighting direction. NO weather.

Distribution:
- 25% TWILIGHT MAGIC-HOUR (5-7) — just after sunset, sky transitioning through pink/violet/blue gradients
- 20% WARM EVENING (4) — bright evening warm-toned festival hour
- 15% GOLDEN HOUR SUNSET (3-4) — warm peach-amber sunset transitioning toward evening
- 15% BLUE HOUR DUSK (3-4) — soft cool-blue dusk just before night, with lanterns lit
- 10% STARRY NIGHT (2) — soft moonlit night with stars + paper-lantern accents
- 8% LATE AFTERNOON (2) — warm golden afternoon light before evening
- 7% DAWN PEARL (2) — soft pearly dawn light just after sunrise

DO write:
"Warm magic-hour twilight, sky transitioning from peach to violet"
"Soft blue hour dusk, lanterns just lit, sky deep periwinkle"
"Golden-hour sunset washing peach-amber tones across the matsuri"
"Starry indigo summer night, paper-lanterns glowing warm against the dark sky"

DO NOT write:
- Light DIRECTION (rim-light / backlit — separate axis)
- Weather (rain / mist / petals — separate axis)
- Setting / character description

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
