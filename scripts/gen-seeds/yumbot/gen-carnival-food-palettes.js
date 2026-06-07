#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot carnival-food renders.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / pale-yellow / cotton-candy-pink)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz / brass)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse / caramel-orange / cherry-red)

━━━ EXAMPLES ━━━

"Soft cotton-candy-pink and baby-blue base with butter-yellow accents, blush highlights, mint touches"
"Rich brass and ruby jewel tones with amber accents, deep cream base, golden glints"
"Vivid hot-magenta and electric-cyan dominant, chartreuse accents, cherry-red highlights"
"Soft pastel mint and pale-pink base with cotton-candy secondary, lavender accents, cream highlights"
"Deep emerald and topaz jewel-tones with brass accents, warm cream foundation, sapphire secondary"
"Saturated caramel-orange and hot-cherry-red dominant, electric green accents, magenta highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
