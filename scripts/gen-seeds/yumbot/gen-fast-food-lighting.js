#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot fast-food renders. Tuned for the 6 fast-food sub-themes (burger / pizza / taco / fries / hot-dog / shake).

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 WARM FAST-FOOD COUNTER (fluorescent + warm-bulb mix)
- 4 SUNNY CART-SIDE (bright outdoor sun, awning shadow)
- 4 NEON DINER GLOW (warm-red + cool-blue neon mix, retro diner)
- 4 WARM FRYER LIGHT (overhead amber + golden fry-bin glow)
- 4 SOFT WINDOW STREAK (pizza-window or food-truck window light)
- 5 RETRO ROADSIDE DINER (golden-hour wash + chrome reflections + neon sign hint)

━━━ EXAMPLES ━━━

"Warm fast-food counter overhead light with subtle fluorescent + amber-bulb mix and soft drop-shadow"
"Bright sunny cart-side light with crisp warm tones and dappled awning-shadow patches"
"Retro diner neon glow mixing warm red and cool blue with subtle reflection on chrome surfaces"
"Warm overhead amber fryer-light with golden bottom-bounce on the food"
"Soft warm window light streaming from camera-left, gentle gold rim catching the food"
"Golden-hour roadside diner wash with chrome reflections and faint neon-sign hint behind"

━━━ HARD BANS ━━━

- NO photographer name-drops, camera specs, lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
