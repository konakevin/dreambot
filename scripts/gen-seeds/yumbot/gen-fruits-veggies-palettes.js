#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot fruits-and-veggies renders. Each entry names 3-5 colors tuned to feel kawaii / garden-fresh.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / sage / pale-yellow)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz — for richly-ripe fruit + magical forest)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse / sun-yellow — for sunny market / orchard)

━━━ EXAMPLES ━━━

"Sage-green and butter-cream base with strawberry-pink accents, blush highlights, soft lavender touches"
"Rich emerald and ruby jewel tones with gold-leaf accents, deep cream base, amber highlights"
"Vivid sun-yellow and electric tangerine dominant, hot-coral accents, chartreuse highlights"
"Soft pastel mint and peach base with butter-yellow secondary, blush accents, baby-blue touches"
"Deep amethyst and emerald jewel-tones with brass accents, warm cream foundation, sage secondary"
"Saturated hot-pink and electric green dominant, sun-yellow accents, magenta highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
