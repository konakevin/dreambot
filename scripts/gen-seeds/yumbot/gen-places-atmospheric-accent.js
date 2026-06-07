#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot unexpected-places renders. Each entry is a small atmospheric flourish — pollen drift / book-dust mote / steam-puff / carnival-confetti / bubble-cloud / fairy-light-glow — tuned for the venues.

Each entry: 10-18 words. ONE specific flourish, understated.

━━━ DISTRIBUTION ━━━

- 4 GREENHOUSE (pollen-drift / drifting-petal / leaf-shadow-flicker / mist-vapor)
- 4 LIBRARY (drifting book-dust mote / pencil-shaving curl / candle-flicker / soft warm haze)
- 4 TRAIN (window-condensation bead / steam-puff outside / motion-blur countryside / linen-fold-shadow)
- 4 CARNIVAL (drifting confetti / popcorn-puff / cotton-candy wisp / string-light-twinkle)
- 4 AQUARIUM (rising bubble-cloud / drifting fish-silhouette / caustic-light-ripple / shadow-fish-blur)
- 5 ROOFTOP (warm-air shimmer / drifting sparkle / city-haze / dust-mote / petal-drift)

━━━ EXAMPLES ━━━

"A soft cloud of pollen-dust drifting through the warm greenhouse air"
"A drift of book-dust motes hanging in the warm library light"
"A bead of condensation slipping down the train window beside the subject"
"A handful of carnival confetti drifting slowly in the warm air"
"A small rising column of aquarium bubbles passing near the subject"
"A drift of warm air shimmer rising from the rooftop herb-pots"

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
