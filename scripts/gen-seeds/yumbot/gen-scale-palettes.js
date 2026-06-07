#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot scale-twist renders. Each entry names 3-5 colors that should dominate, tuned to feel kawaii / epic across 6 scale sub-themes.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach mixes)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz — undersea jewel-coral / cosmic gem-planet)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse — chocolate-river Wonka pop / cosmic nebula)

━━━ EXAMPLES ━━━

"Soft cream and butter-yellow base with strawberry-pink accents and a touch of honey amber"
"Deep cosmic sapphire and amethyst with electric-magenta highlights, warm gold star-accents"
"Vivid hot-pink and electric-cyan dominant, Wonka chocolate-brown base, lime-green accents"
"Soft pastel mint and peach base with coral secondary, cream highlights, lavender touches"
"Rich emerald jewel-tone with ruby coral accents, soft pearl-cream base, golden seaweed glint"
"Saturated cosmic magenta and electric-turquoise nebula with neon-mint accents, deep navy void"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
