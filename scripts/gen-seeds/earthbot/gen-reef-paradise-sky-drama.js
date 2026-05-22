#!/usr/bin/env node
/**
 * EarthBot reef-paradise — SKY DRAMA axis (R2 PIVOT).
 *
 * Clouds + sun + light behavior above the bay. The sky is the SECOND
 * hero (after the bay shoreline). Sun-bursting clouds, golden-hour,
 * brilliant cumulus drama.
 *
 * MVP at 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_sky_drama.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SKY DRAMA entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic). Each entry describes ONE sky configuration — clouds + sun + light behavior ABOVE the bay. Generic descriptors only.

━━━ THE BAR — DRAMATIC TROPICAL SKY (the SECOND hero) ━━━

The sky is doing something INTERESTING. Sun-bursting through cumulus. Golden-hour low-angle light. Brilliant blue with scattered fair-weather cumulus drama. Sun-ray columns shafting through cloud gaps. NEVER a flat blue sky. NEVER overcast-dull. NEVER stormy/dark.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one sky description, 14-28 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **A SKY CONFIGURATION** (the cloud + sun setup — vary across entries):
   - "sun bursting through gaps in fair-weather cumulus"
   - "golden-hour low-angle sunlight raking horizontally across the bay"
   - "brilliant cumulus drifting across a deep cobalt sky"
   - "sun-ray columns shafting down through scattered clouds"
   - "soft golden afternoon light flooding the sky with warm tint"
   - "dramatic backlit cumulus with sun glow rimming the cloud edges"
   - "scattered puffy cumulus drifting across a brilliant blue sky"
   - "sunburst breaking through a partial cloud cover overhead"
   - "high-noon brilliance with thin cirrus stripes streaking the sky"
   - "pre-sunset warm glow filling the upper sky"

2. **A SUN BEHAVIOR** (what the sun is doing):
   - "sun visible mid-upper-frame bursting between clouds"
   - "sun hidden behind a cumulus rim with bright rimming glow"
   - "sun low on the horizon casting warm raking light"
   - "sun high overhead with brilliant direct illumination"
   - "sun-ray columns shafting visible through cloud gaps"
   - "sunburst centered between cloud banks"

3. **A SKY COLOR TINT** (the underlying sky color):
   - "deep cobalt blue sky"
   - "brilliant azure with white cumulus"
   - "warm golden tint flooding the upper sky"
   - "fair-weather blue with crisp white cumulus"
   - "amber-gold afternoon tint across the sky"
   - "pale aquamarine sky with pure-white cloud puffs"

━━━ HARD BANS ━━━

NEVER include:
- Bay / water / coral / shoreline detail
- Camera / composition words
- Humans / aircraft / contrails
- Storm / dark / gloomy / rain / overcast-dull (always sunny)
- Night / moon / stars / sunset-only-twilight (golden-hour OK but never full dusk)
- Named places
- Snow / blizzard / desert haze

━━━ EXAMPLES ━━━

✓ "Sun bursting through gaps in brilliant fair-weather cumulus, sun-ray columns shafting down through cloud gaps, deep cobalt sky"

✓ "Golden-hour low-angle sunlight raking horizontally, warm amber tint flooding the upper sky, soft fair-weather cumulus rim-lit with sun-glow"

✓ "Brilliant cumulus drifting across deep cobalt sky, sun high overhead with direct illumination, crisp puffy clouds with bright white edges"

✓ "Sunburst breaking through a partial cloud cover overhead, dramatic backlit cumulus with sun glow rimming the cloud edges, fair-weather blue sky"

✓ "Sun-ray columns shafting down through scattered clouds, deep azure sky between, soft golden tint where the rays land"

✓ "Pre-sunset warm glow filling the upper sky, brilliant cumulus drifting low, sun visible just above the horizon casting warm raking light"

✓ "High-noon brilliance with thin cirrus stripes streaking across a brilliant azure sky, sun directly overhead casting tack-sharp light"

✓ "Soft golden afternoon light flooding the sky with warm tint, scattered fair-weather cumulus, sun mid-upper-frame between clouds"

✓ "Dramatic backlit cumulus with sun-glow rim, sun hidden behind a cumulus rim, pale aquamarine sky behind"

✓ "Sunburst centered between cloud banks above the bay, sun-ray columns shafting down through the gap, brilliant fair-weather sky"

✗ BAD — bay water: "Sky reflecting in the turquoise water" (allowed lightly, but water_quality axis owns reflections — focus on sky)
✗ BAD — storm: "Dark cloudy sky with rain" (BANNED — always sunny tropical)
✗ BAD — named: "Hawaiian sky" (BANNED — generic)
✗ BAD — moon: "Moonlit sky" (BANNED — daytime only)

━━━ TIME-OF-DAY DISTRIBUTION ━━━

- ~35% high-noon / bright fair-weather
- ~30% sun-bursting through cumulus
- ~20% golden-hour low-angle
- ~10% pre-sunset warm-glow (NOT full sunset)
- ~5% sun-ray-columns through scattered clouds

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Sky + clouds + sun behavior. Always sunny tropical, dramatic. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
