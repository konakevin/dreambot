#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot fast-food renders.

Each entry: 10-18 words. ONE specific flourish, understated.

━━━ DISTRIBUTION ━━━

- 4 FRYER STEAM / VAPOR (hot fry-vapor / sizzle-steam / griddle steam)
- 4 SAUCE / DRIP (ketchup drip / mustard squeeze / cheese-pull strand / hot-sauce arc)
- 4 SOFT DRINK ATMOSPHERE (cup-condensation beads / soda fizz / ice-cube glint)
- 4 NEON SHIMMER (neon-haze / sign-flicker / chrome reflection / glass-glint)
- 4 PAPER / WRAPPER MOTION (paper-wrapper flutter / fries falling mid-air / napkin drift)
- 5 GENERIC WARMTH (warm air shimmer / soft sparkle / drifting dust mote / counter-glow)

━━━ EXAMPLES ━━━

"A delicate wisp of fry-vapor rising from the basket"
"A long ribbon of melted cheese mid-pull from the slice"
"Cold condensation beads forming on the soda cup"
"A soft neon haze drifting across the diner counter"
"A piece of waxed paper flutters in the warm air"
"Warm air shimmer rising softly above the counter"

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
