#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot carnival-food renders.

Each entry: 10-18 words. ONE specific flourish, understated.

━━━ DISTRIBUTION ━━━

- 4 STEAM / VAPOR (funnel-cake steam / pretzel-vapor / corn-dog steam / hot-popcorn rising)
- 4 SUGAR / GLITTER (powdered-sugar drift / cotton-candy-sugar mist / sprinkle-toss / glitter shimmer)
- 4 STRING-LIGHT GLOW (bulb-bokeh sparkle / fairy-light shimmer / lantern-glow halo / sparkle-trail)
- 4 LIQUID-IN-MOTION (lemonade-pour / caramel-drip / shaved-ice-pour / chocolate-drizzle)
- 4 PAPER / WRAPPER MOTION (paper-confetti drift / wrapper-flutter / cone-paper rustle / ticket-paper drift)
- 5 GENERIC WARMTH (warm carnival shimmer / drifting sparkle / festive haze / drifting dust mote / glow-around-light)

━━━ EXAMPLES ━━━

"A delicate curl of funnel-cake steam rising from the basket"
"A soft drift of powdered-sugar mist hanging in the air"
"A sparkling bokeh of string-light glow surrounding the subject"
"A long ribbon of caramel mid-drip onto the apple"
"A handful of paper confetti drifting slowly in the warm air"
"A soft warm carnival shimmer surrounding the booth"

━━━ HARD MANDATES ━━━

- Atmospheric ACCENT is small / understated

━━━ HARD BANS ━━━

- NO subject / scene language
- NO camera / framing language
- NO color palette names
- NO time-of-day labels

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
