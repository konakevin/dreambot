#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot whimsical-concept renders. Each entry is a tiny atmospheric flourish that makes the scene feel ALIVE — flashbulb pop, sparkle particles, drifting bubbles, steam from spa, musical-note swirl, chalk dust, confetti, etc.

Each entry: 10-18 words. ONE specific flourish, present but understated.

━━━ DISTRIBUTION ━━━

- 4 STAGE / SHOW (flashbulb pop / confetti drift / curtain shimmer / spotlight haze / paparazzi flash)
- 4 MUSICAL (drifting musical-note swirl / soft sound-wave glow / vibrating-string halo / sheet-music breeze)
- 4 SPA / STEAM (rising spa steam wisp / drifting bubbles / soft mist haze / candle flicker / aromatic vapor)
- 4 CLASSROOM (chalk-dust puff / paper airplane drift / pencil-shaving curl / floating dust mote)
- 4 PLAYFUL SPARKLE (fairy-sparkle dust / drifting glitter / pixie particles / sugar-glitter cloud)
- 5 GENTLE NATURAL (rising warm air shimmer / floating petal / drifting feather / soft cinnamon puff / drifting dust mote)

━━━ EXAMPLES ━━━

"A single bright camera flashbulb pop bursting from the side of the scene"
"A swirl of drifting musical notes floating up from the subject"
"Rising steam wisp curling slowly from the spa surface"
"A soft puff of chalk dust drifting in the classroom air"
"A drift of warm pixie sparkle particles surrounding the subject"
"A floating pastel feather drifting slowly through the warm air"

━━━ HARD MANDATES ━━━

- Atmospheric ACCENT is small / understated — adds life, doesn't dominate

━━━ HARD BANS ━━━

- NO subject / scene language
- NO camera / framing language
- NO color palette names
- NO time-of-day labels

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
