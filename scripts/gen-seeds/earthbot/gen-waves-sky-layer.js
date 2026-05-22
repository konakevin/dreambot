#!/usr/bin/env node
/**
 * EarthBot waves — SKY LAYER axis.
 *
 * Sky above the wave. Adds depth + mood. Real Earth atmospheric only.
 *
 * R0 = 30.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/waves_sky_layer.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SKY LAYER entries for EarthBot waves. Each entry describes ONE sky condition above the wave. Real Earth sky — supports the wave drama without overshadowing it.

━━━ ABSOLUTELY BANNED ━━━

- Bioluminescent / sci-fi / fantasy sky
- Specific subject content (wave / coast / water)
- Light condition (light_condition axis)
- Single beam / single shaft / single column of light
- Humans / architecture
- "pulsing" / "exploding" / "radiating" / "acid-green" / "flamingo" (sky-drama lesson)

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-24 words each.

━━━ SKY LAYER TYPES ━━━

DRAMATIC STORM SKY:
- Dark storm clouds piling above the wave, mammatus pouches dropping low
- Heavy storm-grey sky with rain curtain visible in the distance
- Mammatus clouds bulging across the upper sky, dark and dramatic

SUNSET / GOLDEN HOUR:
- A warm golden-hour sunset sky burning amber-magenta above the wave
- Sunset sky with scattered cumulus rim-lit copper-rose at the cloud edges
- Warm sunset clouds drifting across the upper frame, magenta-orange gradient
- A burning sunset horizon with the cloud bank lit warm gold-copper

FAIR-WEATHER:
- Brilliant fair-weather blue sky with scattered cumulus
- A clear tropical blue sky with fair-weather cumulus drifting
- Wispy cirrus streaks across a clear tropical blue sky overhead

OVERCAST DRAMATIC:
- A heavy overcast sky with broad spotlight breaking through cloud-tear
- Diffuse grey storm-sky with scattered cloud-breaks letting light through
- Layered storm cloud-bank with broken sunlight piercing the gaps

PRE-STORM:
- Tornado-charcoal storm clouds gathering on the horizon
- A pre-storm grey-violet sky pressing low above the wave

CLEAR DRAMATIC:
- A deep cobalt sky with scattered fair-weather cumulus
- Brilliant crystal-clear sky overhead with high cirrus streaks

━━━ EXAMPLES ━━━

✓ "Dark storm clouds piling above the wave, mammatus pouches dropping low in dramatic textural mass"

✓ "A warm golden-hour sunset sky burning amber-magenta above the wave"

✓ "Brilliant fair-weather blue sky with scattered cumulus drifting in the upper frame"

✓ "A heavy overcast sky with broad spotlight breaking through a cloud-tear, dramatic backlight"

✓ "Tornado-charcoal storm clouds gathering on the horizon behind the wave"

✓ "Sunset sky with scattered cumulus rim-lit copper-rose along the cloud edges"

✓ "A pre-storm grey-violet sky pressing low above the wave in heavy mood"

✓ "Wispy cirrus streaks across a clear tropical blue sky overhead"

✓ "A burning sunset horizon with the cloud bank lit warm gold-copper"

✓ "Diffuse grey storm-sky with scattered cloud-breaks letting beams of light through"

✗ BAD — bioluminescent: "Glowing alien sky above the wave" (BANNED — real Earth sky only)
✗ BAD — pulsing: "Aurora pulsing above the wave" (BANNED — sky-drama lesson)
✗ BAD — wave details: "Sky above a 40-foot wave" (BANNED — sky only)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE sky condition per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
