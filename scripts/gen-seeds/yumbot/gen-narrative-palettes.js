#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot narrative-action renders. Each entry names 3-5 colors that should dominate.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / butter-yellow)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz / brass)
- 5 VIVID SATURATED palettes (hot-magenta / electric-tangerine / chartreuse / parade-pop)

━━━ EXAMPLES ━━━

"Warm cream and butter-yellow base with strawberry-pink accents, honey-amber highlights, mint touches"
"Rich sapphire and amethyst jewel tones with gold-leaf accents, deep cream base, ruby highlights"
"Vivid carnival magenta and electric tangerine dominant, chartreuse accents, sunset coral highlights"
"Soft pastel mint and peach base with cream secondary, dusty rose accents, baby-blue highlights"
"Deep emerald and topaz jewel-tones with brass accents, warm cream foundation, sage secondary"
"Saturated parade hot-pink and electric blue with chartreuse accents, festive yellow highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
