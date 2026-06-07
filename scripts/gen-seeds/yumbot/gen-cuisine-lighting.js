#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot cuisine renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for the 7 cuisine sub-themes (patisserie / trattoria / mercado / cafe / mithai-shop / souk / nordic-bakery).

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 SOFT WINDOW BAKERY GLOW (clean window streak, French/Nordic-bakery-coded)
- 4 WARM PENDANT-LAMP CAFE LIGHT (amber overhead pool, trattoria/Korean-cafe-coded)
- 4 BRIGHT MARKET / FIESTA SUN (warm bright outdoor mercado, Mexican-coded)
- 4 BRASS-LANTERN AMBIENT (warm lantern glow with soft surround, souk + mithai-coded)
- 4 NEON / FAIRY-STRING ACCENT (warm + cool soft pop, Korean dessert cafe-coded)
- 5 GENERIC CUISINE-FRIENDLY (clean balanced fill, multi-cuisine-coded)

━━━ EXAMPLES ━━━

"Soft warm window light streaming from camera-left, gentle gold rim catching the subject"
"Warm pendant-lamp glow from above, amber ambient with soft drop shadow underneath"
"Bright sunny outdoor mercado light with warm overhead sun and dappled umbrella patches"
"Warm brass-lantern glow from above-right, soft amber ambient with deep warm surround"
"Soft neon-pink-and-mint cafe accent washing the subject, gentle ambient room fill"
"Clean balanced cuisine-counter fill, gentle even key with soft warm tint"

━━━ HARD BANS ━━━

- NO photographer name-drops, NO camera specs, NO lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
