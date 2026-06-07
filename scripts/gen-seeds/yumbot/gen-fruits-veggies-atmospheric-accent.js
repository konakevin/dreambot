#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot fruits-and-veggies renders. Each entry is a small atmospheric flourish — pollen drift / dew-sparkle / falling leaf / blossom-shower / forest-spore drift / market-haze.

Each entry: 10-18 words. ONE specific flourish, understated.

━━━ DISTRIBUTION ━━━

- 4 GARDEN ATMOSPHERE (pollen-drift / dew-sparkle / drifting leaf-petal / soil-mist)
- 4 ORCHARD ATMOSPHERE (blossom-shower / drifting petal / leaf-flutter / fruit-fragrance shimmer)
- 4 VINE ATMOSPHERE (drifting leaf / dew-droplet / dragonfly-wing-trail / soft warm shimmer)
- 4 FOREST ATMOSPHERE (drifting forest-spore / mossy-air shimmer / mushroom-mist / fern-shadow-flutter)
- 4 MARKET ATMOSPHERE (drifting awning-dust / warm market-haze / linen-fold-shadow / paper-bag rustle)
- 5 GENERAL OUTDOOR (sun-warm air shimmer / drifting petal / warm breeze ripple / dust-mote drift)

━━━ EXAMPLES ━━━

"A soft drift of pollen-dust motes hovering in the warm garden air"
"A scattering of pastel apple-blossom petals falling slowly past the subject"
"A delicate drift of dew-droplets sparkling on the surrounding leaves"
"A soft drift of forest-spore-dust glowing in a shaft of light"
"A warm market-haze shimmer rising softly above the crate"
"A sun-warm air shimmer drifting gently around the subject"

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
