#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot whimsical-concept renders. Each entry names 3-5 colors that should dominate the render — tuned to feel kawaii / cozy / playful across the 6 whimsical sub-themes.

Each entry: 12-20 words. ONE specific palette (3-5 named colors with relationship).

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 14 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / baby-blue mixes)
- 6 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz / garnet — rich saturated kawaii)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse / fuschia / tangerine — Lisa-Frank popping)

Within those palette tilts, distribute across the sub-themes so each (with-pets / fashion-show / spa / orchestra / school / and-toys) feels supported.

━━━ EXAMPLES ━━━

"Blush pink base with cream and mint accents, dusty lavender highlights, butter-yellow secondary"
"Hot pink and electric cyan dominant, fuschia accents, chartreuse highlights, popping Lisa-Frank energy"
"Rich sapphire and ruby jewel tones with gold-leaf accents, deep amethyst secondary, glittering cream highlights"
"Sunrise-orange and peach base with strawberry accent, cream secondary, baby-blue touches"
"Warm cocoa-brown and cream foundation with sage-green accent, pale gold highlights, blush secondary"
"Emerald and gold-leaf dominant with rich amethyst accents, deep cream base, ruby touches"

━━━ HARD BANS ━━━

- NO single-color palettes (entries name 3-5 colors with relationships)
- NO lighting-quality language inside the palette
- NO scene/camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
