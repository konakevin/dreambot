#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot cuisine renders. Each entry is one specific framing — focal length implied by intimacy + angle + what fills the frame. Tuned for cuisine-context scenes (patisserie counter / trattoria table / mercado stall / cafe / mithai shop / souk / bakery window).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 OVERHEAD FLAT-LAY (patisserie tray top-down / mithai tray-spread)
- 4 STRAIGHT-ON EYE-LEVEL (counter / display-case portrait)
- 4 OFF-CENTER RULE-OF-THIRDS
- 4 LOW HERO-UP (looking up at the food, monumental cuisine register)
- 4 THREE-QUARTER LEAN (slight tilt revealing depth + cuisine context)
- 5 WIDE COUNTER / STALL (showing food + cuisine setting context)

━━━ EXAMPLES ━━━

"Overhead flat-lay framing, food centered on the cuisine surface, props radiating outward"
"Eye-level intimate portrait, food filling sixty percent of frame, shallow blurred background"
"Off-center composition with food in left third, cuisine setting breathing on right"
"Low hero-up angle gazing upward at the food, monumental presence over the cuisine counter"
"Three-quarter lean revealing depth and cuisine setting context behind the subject"
"Wide counter framing showing food and full cuisine stall / shop in context"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
