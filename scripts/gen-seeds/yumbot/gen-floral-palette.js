#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_palette.json',
  total: 30,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} COLOR-PALETTE prompts for YumBot floral-garden-cup. Each is the 3-4 dominant pastel colors for this render.

Each entry: 8-12 words. ONE specific palette.

━━━ DISTRIBUTION ━━━

- 20% PURPLE-DOMINANT (pastel-purple + lavender + cream + dusty-rose / lilac + soft-violet + pearl-cream + mint)
- 20% PINK-DOMINANT (pastel-pink + cream + peach + blush / hot-pink-pastel + cream + lavender + pearl-white)
- 15% CREAM-DOMINANT (pearl-cream + soft-peach + dusty-pink + butter-yellow / antique-cream + pastel-pink + pearl-white + mint)
- 10% BLUE-DOMINANT (pastel-blue + cream + soft-pink + lavender / dusty-blue + pearl-white + peach + cream)
- 10% PEACH-DOMINANT (peach + cream + pastel-pink + butter-yellow / coral-peach + cream + dusty-pink)
- 10% MINT-DOMINANT (pastel-mint + cream + pastel-pink + lavender / sage-mint + pearl + peach)
- 10% RAINBOW-PASTEL (pastel-pink + lavender + mint + peach + cream + pastel-blue all-mixed)
- 5% YELLOW-DOMINANT (butter-yellow + cream + soft-pink + mint / dusty-yellow + pearl-cream + lavender)

━━━ HARD BANS ━━━

- NO saturated / vivid / electric colors
- NO dark / moody
- NO neon

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
