#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for CuddleBot — soft storybook lighting treatments with BROAD variety. 10-20 words each. Cozy/wholesome always, but the previous pool had 39/50 entries saying "warm" — far too warm-heavy. Invent fresh treatments spanning the full time-of-day / temperature / source spectrum.

━━━ HARD DIVERSITY CAPS (enforced) ━━━
Across the full pool of 50:
- Max 15 entries with warm palette emphasis (amber / honey / orange / peach / golden / warm)
- Min 10 entries cool-palette (blue / silver / periwinkle / cool-cream / mint / pearl / frost)
- Min 8 entries with distinctive time-of-day (pre-dawn, blue-hour, moonlit, twilight, overcast)
- Min 5 entries using magical/supernatural sources (firefly, bioluminescent, aurora, starlight, rainbow-prism, pixie-dust)
- Min 5 entries from unexpected atmospheric conditions (rainy-window, snow-ambient, mist-diffuse, fog-silver, overcast-even)

━━━ EVERY ENTRY MUST BE UNIQUE ━━━
No two lighting treatments may share the same primary source AND same palette. Vary the light-source (candle / lamp / window / sky / fire / magical / reflected / diffused) AND the resulting palette across entries. Treat each entry as a genuinely new lighting idea.

━━━ RULES ━━━
- Always soft + cozy-compatible (never harsh, dark, stark-contrast)
- Must specify the SOURCE of light + the RESULTING atmosphere
- Treat the caps as non-negotiable distribution rules
- Cozy-feel permitted even in cool-palette entries (cool does not mean cold-hearted)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
