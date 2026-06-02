#!/usr/bin/env node
/**
 * EarthBot cozy-beach — SKY LAYER axis (v2 pivot).
 *
 * Warm cozy sky — sunset / golden / fair-weather. NEVER dramatic.
 *
 * R0 = 25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_sky_layer.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SKY LAYER entries for EarthBot cozy-beach (v2 — intimate beach moments). Each entry describes ONE warm cozy sky context. NEVER dramatic / stormy.

━━━ ABSOLUTELY BANNED ━━━

- Storms / lightning / supercells / dramatic weather
- Bioluminescent / fantasy / sci-fi
- Architecture / setting details / water details
- Humans
- Single beam / single shaft (laser trigger)

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ SKY TYPES ━━━

- Warm sunset sky in amber-magenta gradient above
- Soft warm rose-pink sunset sky overhead
- Fair-weather cumulus drifting across a deep tropical blue sky
- A peach-orange golden-hour sky overhead
- Soft warm post-sunset glow filling the upper sky
- A clear cobalt sky with soft fair-weather cumulus drifting
- A warm copper-amber sunset sky with scattered cumulus rim-lit
- Soft warm afternoon sky with wispy cirrus streaks
- A gentle pre-sunset warm sky with soft cumulus drifting overhead
- Warm golden-hour color flooding the upper sky overhead

━━━ EXAMPLES ━━━

✓ "Warm sunset sky in amber-magenta gradient above"

✓ "Fair-weather cumulus drifting across a deep tropical blue sky"

✓ "A peach-orange golden-hour sky overhead"

✓ "Soft warm post-sunset glow filling the upper sky"

✓ "A warm copper-amber sunset sky with scattered cumulus rim-lit"

✓ "Soft warm afternoon sky with wispy cirrus streaks"

✓ "Warm golden-hour color flooding the upper sky overhead"

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Warm cozy sky only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
