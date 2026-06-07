#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot whimsical-concept renders. Each entry is ONE prop / decoration / smallish object — instruments / runway props / spa accessories / classroom supplies / toys / pet supplies. The render's brief picks 2-4 per shot, so each entry must be self-contained and combinable.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 TINY INSTRUMENTS (mini violin / cello / trumpet / piano / drum / conductor's baton / sheet music)
- 4 RUNWAY-FASHION PROPS (mini sunglasses / tiny purse / fashion-magazine / spotlight stand / velvet rope)
- 4 SPA ACCESSORIES (mini towel / cucumber-slice / soap-bar / loofah / candle / robe)
- 4 CLASSROOM SUPPLIES (mini pencil / notebook / apple / chalkboard / lunchbox / ruler)
- 4 TOY PROPS (mini wooden block / plushie / paper boat / tiny ball / tiny dollhouse)
- 5 SMALL VESSELS / SHARED PROPS (mini tea cup / saucer / vase / napkin / posy / fork)

━━━ EXAMPLES ━━━

"A tiny gleaming violin with bow propped on a small stand"
"A pair of mini round sunglasses with pastel frames"
"A small folded white spa towel with a cucumber slice on top"
"A miniature wooden pencil with a chewed eraser at the end"
"A tiny wooden building-block with a kawaii letter painted on it"
"A small ceramic tea cup with a heart-shaped handle"

━━━ HARD MANDATES ━━━

- Self-contained — clean when 2-4 are combined per render
- Specific item, not a category

━━━ HARD BANS ━━━

- NO color / palette / lighting language
- NO companion creatures (companions are their own axis)
- NO camera / framing language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
