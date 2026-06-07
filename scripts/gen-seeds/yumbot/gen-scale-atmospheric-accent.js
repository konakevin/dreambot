#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot scale-twist renders. Each entry is a small flourish — city steam grate / drifting micro-pollen / island salt-spray / chocolate-splash / undersea bubble / cosmic-stardust — tuned for the scale contexts.

Each entry: 10-18 words. ONE specific flourish, understated but present.

━━━ DISTRIBUTION ━━━

- 4 URBAN VAPOR / DUST (city steam vent / drifting smog wisp / pigeon-flight blur — giant-real-world)
- 4 MICRO DUST / POLLEN (drifting pollen mote / sugar-grain drift / single-bubble — microscopic)
- 4 ISLAND SPRAY / WIND (frosting-foam spray / candy-blossom petal drift / sweet-breeze ripple — food-island)
- 4 CHOCOLATE-SPLASH / GLAZE (chocolate-river ripple / honey-drip splash / sugar-cane sway — chocolate-river)
- 4 UNDERSEA BUBBLE / RIPPLE (rising sugar-bubble / cotton-candy-current / glittering plankton — underwater)
- 5 COSMIC SHIMMER / STARDUST (drifting stardust / nebula-cloud / comet-tail / sparkle particles — food-in-space)

━━━ EXAMPLES ━━━

"A whorl of steam rising from a tiny city grate at the colossal subject's feet"
"A drift of micro-pollen motes hanging in the warm air"
"A salt-spray-foam mist drifting off the frosting-shore"
"A glossy chocolate splash arc rising from the river surface"
"A small column of sugar-bubbles rising from the seafloor"
"A glittering trail of cosmic stardust streaming behind the subject"

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
