#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_creatures.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} KAWAII POND-CREATURE descriptions for a Japanese koi-pond scene. Each entry is ONE kawaii pond inhabitant — koi-fish, axolotl, cloud-mochi-spirit, pearl-blob, lily-frog, or similar kawaii water-creature WITH a kawaii face (closed-arc-eyes, blush cheeks, tiny mouth).

Each entry: 14-26 words. ONE specific creature with kawaii face. Painterly Pop-Mart-meets-Studio-Ghibli register.

Mix creature types:
- 35% smiling koi-fish (various color patterns — pink, lavender, white-and-pink, pearl, blush-orange-with-cream, etc.)
- 20% kawaii cloud-mochi-spirits / pearl-blob-creatures (round soft blob-creatures with kawaii faces)
- 15% smiling axolotls (with feathery gills — pastel-pink, lavender, cream)
- 12% kawaii lily-frogs (cute round frogs perched on lily-pads)
- 8% kawaii water-spirits (translucent jelly-like spirits with kawaii faces)
- 5% kawaii turtles (small pastel turtles with cute faces)
- 5% kawaii lotus-bud-creatures (tiny creatures shaped like lotus-buds with smiling faces)

DO write:
- A smiling pearl-pink koi-fish with closed-arc eyes, blush cheeks, and cream-and-pink dappled scales
- A smiling lavender cloud-mochi-spirit with closed-arc eyes, round soft body, and tiny blush mouth
- A smiling cream-and-pink axolotl with feathery gill-frills and big closed-arc smile
- A smiling pastel lily-frog perched on a lily-pad with kawaii face and pink-tinted skin
- A smiling pearl-white koi with kawaii face, glossy scales, and tiny dorsal fin
- A smiling kawaii water-spirit jelly-like translucent body with pink kawaii face floating
- A smiling small pastel-lavender turtle with cute closed-arc-eyes and pearl-trim shell
- A smiling lotus-bud-creature curled like a flower-bud with kawaii face peeking out
- A smiling soft-pink koi with kawaii face and dappled-pearl scales swimming gently
- A smiling kawaii cloud-spirit shaped like a soft cumulus puff with kawaii face

DO NOT write:
- Photo-real fish / amphibians — kawaii Pop-Mart style only
- Humans / chibi figures
- Foods
- Aggressive / scary creatures — soft kawaii only
- Modern objects

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
