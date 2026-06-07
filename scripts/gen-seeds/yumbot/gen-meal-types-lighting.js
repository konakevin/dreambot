#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot meal-types renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for cozy / kawaii food photography across breakfast / high-tea / picnic / coffee-shop / food-truck / midnight-snack contexts.

Each entry: 14-22 words. ONE specific lighting direction (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 5 SOFT MORNING WINDOW LIGHT (warm window streak, gentle, breakfast-coded)
- 4 BRIGHT AFTERNOON DIFFUSED (gentle overcast or filtered window, high-tea-coded)
- 4 SUN-DAPPLED OUTDOOR (warm sun through leaves / open sky, picnic-coded)
- 4 WARM CAFE OVERHEAD (pendant lamps, amber ambient, coffee-shop-coded)
- 4 NEON-LIT NIGHT (signage glow, magenta + teal, food-truck-coded)
- 4 INTIMATE LAMP GLOW (small warm spotlight, deep dim surround, midnight-snack-coded)

━━━ EXAMPLES ━━━

"Soft morning window light streaking from camera-left, golden warm rim catching the top of the subject"
"Bright but diffused overcast afternoon light, gentle even illumination, no harsh shadows"
"Sun-dappled outdoor light filtered through leaves overhead, scattered warm patches across the scene"
"Warm pendant-lamp glow from above, amber ambient room light, soft drop-shadow underneath the subject"
"Magenta-and-teal neon signage glow from the side, rim-lighting the kawaii silhouette"
"Tight intimate amber lamp puddle on the subject, deep warm-dim surround fading to soft shadow"

━━━ HARD BANS ━━━

- NO photographer name-drops, NO camera specs, NO lens language
- NO color palette names ("pastel-pink palette") — palette is its own axis
- NO time-of-day labels ("sunrise" / "dusk") — time-of-day is its own axis
- NO mood adjectives ("dreamy" / "magical") — let the light source carry it

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
