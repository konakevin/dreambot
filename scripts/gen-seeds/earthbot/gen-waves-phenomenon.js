#!/usr/bin/env node
/**
 * EarthBot waves — PHENOMENON axis (conditional 30%-gated).
 *
 * Rare optical event woven into the wave scene. Sparingly used.
 *
 * R0 = 25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/waves_phenomenon.json',
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PHENOMENON entries for EarthBot waves. Each entry describes ONE rare optical event woven into the wave scene. 30%-gated conditional axis — fires on minority of renders.

━━━ ABSOLUTELY BANNED ━━━

- Multiple phenomena per entry (ONE only)
- Single beam / single shaft / single column of light
- "pulsing" / "exploding" / "radiating" / "acid-green" (sky-drama lesson)
- Sci-fi / fantasy / bioluminescent
- Architecture / humans

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ PHENOMENON TYPES ━━━

RAINBOW / SPRAY OPTICS:
- A small spray-formed micro-rainbow visible through the wave's spray
- A double rainbow arc curving over the breaking wave
- A faint fogbow arc visible through the wave's mist
- A circular spray-rainbow visible in the wave's exploding mist

CREPUSCULAR / GOD-RAYS:
- Crepuscular rays plural fanning down through scattered cloud-gaps illuminating the spray
- Multiple shafts of light fanning through cloud-break onto the wave

SUN-OPTICAL:
- A faint halo ring visible around the sun overhead
- A sun-pillar rising vertical from the horizon behind the wave
- A sun-dog parhelion pair visible flanking the sun

SKY EVENTS:
- A distant lightning fork visible at the horizon
- A double rainbow arc complete across the sky behind the wave

━━━ EXAMPLES ━━━

✓ "A small spray-formed micro-rainbow visible through the wave's spray in faint refractive color"

✓ "A double rainbow arc curving over the breaking wave, both arcs sharp against storm-grey backdrop"

✓ "Crepuscular rays plural fanning down through scattered cloud-gaps illuminating the spray"

✓ "A faint halo ring visible around the sun overhead"

✓ "A sun-pillar rising vertical from the horizon behind the wave"

✓ "A faint fogbow arc visible through the wave's mist in pearl-pale refraction"

✓ "A distant lightning fork visible at the deep horizon behind the storm-break"

✓ "A sun-dog parhelion pair visible flanking the sun on either side"

✓ "Multiple shafts plural fanning through cloud-break onto the cresting wave"

✗ BAD — multiple: "Rainbow AND aurora AND lightning" (BANNED — ONE)
✗ BAD — sci-fi: "A glowing portal in the sky" (BANNED)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE rare phenomenon per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
