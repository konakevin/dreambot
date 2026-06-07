#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot cuisine renders. Each entry names 3-5 colors that should dominate the render — tuned to feel kawaii / culturally-warm across 7 cuisine sub-themes.

Each entry: 12-20 words. ONE specific palette (3-5 named colors with relationship).

━━━ PALETTE TILT DISTRIBUTION — MANDATORY MIX ━━━

- 13 SOFT PASTEL palettes (blush / mint / lavender / cream / peach / butter-yellow / sage)
- 7 JEWEL-TONE palettes (sapphire / emerald / ruby / amethyst / topaz / garnet / gold-leaf — rich cuisine cultural codes)
- 5 VIVID SATURATED palettes (hot-magenta / electric-tangerine / chartreuse / fiesta-coral — Mexican fiesta / souk pop)

Each cuisine pulls naturally to different palette tilts (French = pastel; Indian = jewel-tone gold/saffron/ruby; Mexican = vivid fiesta; Nordic = soft pastel; Middle-eastern = jewel-tone amber/garnet; Korean = pastel + neon accents; Italian = warm cream + ruby + sage).

━━━ EXAMPLES ━━━

"Soft blush-cream base with butter-yellow and dusty rose accents, sage-green secondary touches"
"Rich gold-leaf and saffron jewel tones with deep ruby accents, warm cream base, marigold touches"
"Vivid hot-coral and electric-turquoise dominant, fiesta-yellow accents, papel-picado magenta highlights"
"Pastel cream and birch-blonde base with soft sage secondary, blush accent, baby-blue highlights"
"Deep amber and garnet jewel-tones with brass accents, warm cream foundation, mint-tea green secondary"
"Soft pastel pink and mint base with neon-accent magenta touches, cream secondary, soft lavender highlights"

━━━ HARD BANS ━━━

- NO single-color palettes
- NO lighting-quality language
- NO scene/camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
