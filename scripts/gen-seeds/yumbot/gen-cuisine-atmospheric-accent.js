#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot cuisine renders. Each entry is a tiny atmospheric flourish — steam from a pasta bowl / sugar dust on patisserie / cinnamon shake on bun / saffron-dust drift / mint-tea steam curl / etc.

Each entry: 10-18 words. ONE specific flourish, understated but present.

━━━ DISTRIBUTION ━━━

- 4 STEAM / VAPOR (pasta-bowl steam / mint-tea curl / coffee steam / cocoa vapor / freshly-baked-bread heat)
- 4 SPICE / DUST (saffron-thread drift / cinnamon-shake / nutmeg-puff / pistachio-flake / powdered-sugar mist)
- 4 SUGAR / GLAZE (drifting glaze drip / honey-strand / cream-drizzle / chocolate-thread / syrup-pour mid-air)
- 4 PETAL / HERB DRIFT (drifting marigold petal / mint-leaf / basil-leaf / lavender / rose petal)
- 4 LANTERN / LIGHT (warm lantern haze / fairy-light bokeh / candle flicker / soft window-shaft / brass glow)
- 5 GENERIC SPARKLE / WARMTH (warm air shimmer / soft sparkle / drifting dust mote)

━━━ EXAMPLES ━━━

"A delicate curl of steam rising from a kawaii pasta bowl"
"Soft drift of saffron threads suspended in warm air"
"A long ribbon of golden honey mid-pour caught in motion"
"A floating mint-leaf drifting slowly past the subject"
"A soft warm lantern haze settling over the cuisine counter"
"A drift of warm sparkle dust surrounding the subject gently"

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
