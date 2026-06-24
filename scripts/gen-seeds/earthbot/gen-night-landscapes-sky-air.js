#!/usr/bin/env node
/**
 * EarthBot night-landscapes — SKY_AIR axis (what the AIR is doing).
 *
 * Axis-clean: ONLY the air/atmosphere — transparency, thin cloud, mist. NO
 * light, NO stars/moon/aurora, NO geology. Adds depth + a sense of real
 * conditions to the night without crossing into the sky-light or land axes.
 *
 * MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/night_landscapes_sky_air.json',
  total: 120,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERE entries for EarthBot's night-landscapes path. Each describes ONLY what the AIR is doing on a clear-ish night — transparency, a thin wisp of cloud, low mist, frost-crisp air. Adds real-condition depth. A separate axis owns the stars/moon/aurora and another owns the light, so stay strictly OFF those.

━━━ AXIS-CLEAN — AIR ONLY ━━━

ONLY air/atmosphere. NO moon, NO stars, NO Milky Way, NO aurora, NO meteors, NO lighting/colors-of-light, NO geology. (You may say mist "pools in the valley" or clings to the water — just never how it's lit.)

━━━ THE BAR ━━━

Real, restrained night-air conditions — mostly clear and transparent (a dark sky needs clarity), with occasional thin high cloud or low ground mist for depth. Never heavy overcast (that hides the sky), never storm.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

JSON array of STRINGS, each 10-20 words.

━━━ SPAN (rotate; weight toward CLEAR ~45%) ━━━

- crystalline high-altitude transparency, the air razor-clear and still
- cold frost-crisp air, a faint haze of breath-fog drifting low and dissolving
- a thin veil of high cirrus drifting across the upper sky, soft and translucent
- low ground mist pooling along the valley floor and over the still water
- a shallow band of fog hugging the lake surface, the higher air clear above
- wisps of low cloud snagging on the ridgelines, the rest of the sky open
- still, dry, perfectly clear air with deep transparency to the horizon
- a soft layer of valley fog softening the distance, clear directly overhead

━━━ EXAMPLES ━━━

✓ "Crystalline high-altitude transparency, the air razor-clear and perfectly still"
✓ "Low ground mist pooling along the valley floor and drifting over the still water"
✓ "A thin veil of high cirrus drifting across the upper sky, soft and translucent"
✓ "Cold frost-crisp air with a faint low haze dissolving over dark earth"

✗ BAD — light leak: "Moonlit fog glowing silver" (light belongs to another axis)
✗ BAD — overcast: "Heavy thick clouds covering the whole sky" (hides the night sky)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Air only. No preamble, no markdown, no keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
