#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for CuddleBot. Each palette is 10-20 words naming 3-5 color words + a one-beat atmospheric tone. Previous pool was 90% yellow-orange tinted (peach/amber/honey/cream) — invent fresh, diverse palettes across the full cozy-wholesome spectrum.

━━━ HARD DIVERSITY CAPS (enforced) ━━━
Across the full pool of 50:
- Max 15 palettes lean warm (amber / honey / peach / cream / orange / rust / gold)
- Min 8 palettes lean cool (blue / aqua / mint / periwinkle / silver / frost)
- Min 5 palettes lean green (sage / moss / eucalyptus / forest / olive)
- Min 5 palettes lean pink-beyond-peach (rose / blush / sakura / coral / berry)
- Min 5 palettes lean purple/lavender (lilac / wisteria / heather / violet)
- Min 5 palettes in unexpected-cozy territory (dusty teal, moody plum-pastel, sage-pewter, stormy-soft, neutral-dove)

━━━ EVERY ENTRY MUST BE UNIQUE ━━━
No two palettes share the same dominant color family. Do not repeat adjective combinations. If a palette is in the "warm" bucket, its 3-5 colors must differ from every other warm palette's colors. Treat each as a genuinely new palette no one else has invented.

━━━ RULES ━━━
- Always wholesome + cozy-compatible (never sharp-contrast, never dark-dominant)
- 3-5 specific color words per entry
- Treat the caps as non-negotiable distribution rules

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
