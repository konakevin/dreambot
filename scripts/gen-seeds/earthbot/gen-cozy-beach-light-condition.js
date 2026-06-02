#!/usr/bin/env node
/**
 * EarthBot cozy-beach — LIGHT CONDITION axis (v2 pivot).
 *
 * Golden hour DOMINANT — cozy is warm always. NEVER cold / overcast-dim.
 *
 * R0 = 25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_light_condition.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHT CONDITION entries for EarthBot cozy-beach (v2 — intimate beach moments). Warm cozy light only — golden hour dominant.

━━━ ABSOLUTELY BANNED ━━━

- Single beam / single shaft / single column of light (laser trigger)
- Storms / dim cold light
- Subject details / setting details
- Architecture / village
- Humans

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ LIGHT CONDITION TYPES ━━━

GOLDEN HOUR DOMINANT (~70%):
- Golden-hour warm copper-amber light raking horizontally across the foreground sand
- Late-afternoon warm copper-rose light flooding the entire scene
- Golden-hour saturation warming the foreground sand in amber-rose tones
- Warm raking sunset light across the foreground in copper-gold
- Last-light warm amber-rose light skimming the foreground
- Pre-sunset warm honey-gold light flooding the scene
- Late afternoon warm sidelight in soft amber-copper

SOFT WARM AFTERNOON (~20%):
- Soft warm afternoon light filtering through the canopy onto warm sand
- Gentle warm afternoon side-light raking across the foreground
- Soft tropical warm-light overhead, gentle across the foreground

WARM CLOUD-BREAK (~10%):
- Warm cloud-break light spilling broadly across the foreground in soft golden tones
- Soft scattered cloud-gap light fanning warm across the foreground sand

━━━ EXAMPLES ━━━

✓ "Golden-hour warm copper-amber light raking horizontally across the foreground sand"

✓ "Late-afternoon warm copper-rose light flooding the entire scene"

✓ "Soft warm afternoon light filtering through the canopy onto warm sand"

✓ "Warm raking sunset light across the foreground in copper-gold"

✓ "Pre-sunset warm honey-gold light flooding the scene"

✓ "Warm cloud-break light spilling broadly across the foreground in soft golden tones"

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Warm cozy light only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
