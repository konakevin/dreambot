#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot unexpected-places renders. Each entry names 3-5 colors tuned to feel kawaii / inviting across the 6 venue sub-themes.

Each entry: 12-20 words. ONE specific palette.

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / sage)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / brass / amber)
- 5 VIVID SATURATED palettes (hot-magenta / electric-cyan / chartreuse — carnival pop)

━━━ EXAMPLES ━━━

"Sage-green and butter-cream base with blush pink accents, soft lavender highlights, terracotta secondary"
"Warm brass and amber jewel tones with deep mahogany accents, cream foundation, soft sage touches"
"Vivid carnival magenta and electric cyan dominant, chartreuse accents, sunset orange highlights"
"Soft cream-and-mint base with butter-yellow secondary, blush accents, baby-blue touches"
"Deep sapphire and emerald jewel-tones with pearl-white accents, cool gray base, mint highlights"
"Warm sunset orange and amber base with blush pink secondary, sage accents, cream highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting / scene / camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
