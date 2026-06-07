#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot narrative-action renders. Each entry is a small atmospheric flourish in mid-action — flour-dust puff / garden-pollen drift / shop-window steam / parade-confetti / tea-steam-curl / paper-airplane wisp.

Each entry: 10-18 words. ONE specific flourish, understated but present.

━━━ DISTRIBUTION ━━━

- 4 KITCHEN ATMOSPHERE (flour-puff / butter-melt / sugar-shake / oven-heat shimmer)
- 4 GARDEN ATMOSPHERE (pollen-drift / leaf-flutter / petal-shower / dew-sparkle)
- 4 SHOP-WINDOW ATMOSPHERE (window-steam / reflection-glint / bell-shake-shimmer / sugar-mist)
- 4 PARADE ATMOSPHERE (confetti-cloud / ribbon-streamer / drum-pulse-haze / banner-flutter)
- 4 TEA-PARTY ATMOSPHERE (tea-steam-curl / sugar-dust / saucer-clink-shimmer / honey-strand)
- 5 DELIVERY ATMOSPHERE (paper-flutter / wheel-dust / wind-streamer / spark-shimmer / glide-trail)

━━━ EXAMPLES ━━━

"A soft puff of flour-dust drifting in the warm kitchen air"
"A drift of pollen-motes hanging in the warm garden sunshine"
"A swirl of confetti cascading down through the parade air"
"A delicate curl of tea-steam rising from the kettle spout"
"A trailing flutter of papers behind a delivery in motion"
"A subtle warm shimmer from the open oven door"

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
