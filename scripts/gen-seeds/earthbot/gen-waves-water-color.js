#!/usr/bin/env node
/**
 * EarthBot waves — WATER COLOR axis.
 *
 * The specific water color / quality of the wave. Real ocean colors only.
 *
 * R0 = 30.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/waves_water_color.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WATER COLOR entries for EarthBot waves. Each entry describes ONE specific water color signature for the wave. Real ocean colors only.

━━━ THE BAR — REAL OCEAN COLOR ━━━

Translucent emerald, jade, cobalt-deep, sapphire, turquoise, gold-glint, churning-white-foam, midnight-cobalt, jade-tube. Captures the SPECIFIC color of THIS wave/water in the rolled scene.

━━━ ABSOLUTELY BANNED ━━━

- Bioluminescent / phosphorescent / glowing waves (sci-fi)
- Fantasy colors (no acid-green / flamingo-pink / neon)
- Wave details (wave_subject axis)
- Coastal context (coastal_context axis)
- Sky details / light condition
- Humans
- Architecture

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ WATER COLOR TYPES ━━━

TRANSLUCENT BARREL:
- Translucent emerald wave water with backlight glowing jade through the tube
- Jade-green translucent water with the inside of the barrel visible
- Translucent turquoise wave-face glowing aqua with sun-backlight
- Crystal-clear cobalt-to-aquamarine wave water with reef visible beneath

BIG-WAVE WATER:
- Deep sapphire wave wall with white-foam crashing at the lip
- Dark cobalt deep-water wall with white-spray exploding at the crest
- Saturated midnight-cobalt face with hail-white foam at the lip
- Heavy slate-blue wave wall with churning white-foam

CHURNING / SPRAY:
- Churning white-foam covering the wave's broken face, water exploding in spray
- Dense white-spray plume rocketing skyward, hail-white foam at the base
- Foam-churning surface in the wave's wake, dense white-water spilling forward

GOLDEN / WARM:
- Translucent gold-glint wave water catching warm sunset light through the tube
- Amber-gold translucent wave with backlit sunset color shining through
- Warm copper-amber tint across the wave-face at golden hour

COBALT GRADIENT:
- Saturated cobalt-blue wave face transitioning to turquoise at the shallower edge
- Deep ultramarine wave water with translucent turquoise at the lip

━━━ EXAMPLES ━━━

✓ "Translucent emerald wave water with backlight glowing jade through the tube"

✓ "Deep sapphire wave wall with white-foam crashing at the lip in explosive contrast"

✓ "Crystal-clear cobalt-to-aquamarine wave water with reef visible beneath the translucent face"

✓ "Translucent gold-glint wave water catching warm sunset light through the tube"

✓ "Dense white-spray plume rocketing skyward, hail-white foam at the base of the breaking wave"

✓ "Saturated midnight-cobalt face with hail-white foam at the lip in dramatic contrast"

✓ "Jade-green translucent water with the inside of the barrel visible in soft saturation"

✓ "Heavy slate-blue wave wall with churning white-foam at the breaking point"

✓ "Warm copper-amber tint across the wave-face at golden hour, saturation maximized"

✓ "Saturated cobalt-blue wave face transitioning to turquoise at the shallower reef edge"

✗ BAD — sci-fi: "Bioluminescent electric-blue glowing wave" (BANNED)
✗ BAD — fantasy: "Acid-green wave water" (BANNED — real ocean colors)
✗ BAD — wave details: "Wave wall in cobalt water" (allowed lightly — but focus on COLOR not the wave-shape)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE water color signature per entry. Real ocean colors only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
