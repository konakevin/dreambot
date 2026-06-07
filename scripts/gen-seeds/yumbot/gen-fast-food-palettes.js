#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot fast-food renders.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / sage / butter-yellow)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / topaz / brass / amber)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse / ketchup-red / mustard-yellow)

━━━ EXAMPLES ━━━

"Soft cream and butter-yellow base with mustard-amber accents, blush highlights, mint touches"
"Rich brass and amber jewel tones with ruby accents, deep cream base, golden glints"
"Vivid ketchup-red and mustard-yellow dominant, electric mint accents, hot-magenta highlights"
"Soft pastel mint and cream base with sesame-amber secondary, blush accents, baby-blue highlights"
"Deep ruby and brass jewel-tones with amber accents, warm cream foundation, mint secondary"
"Saturated chartreuse and hot-orange dominant, electric cyan accents, magenta highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
