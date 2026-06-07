#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot scale-twist renders. Each entry is one framing tuned for scale-twist scenes (colossal hero / microscopic ant-view / island wide-vista / river-tracking / undersea drift / cosmic-wide).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 5 LOW HERO-UP (colossal subject towering, monumental compact presence)
- 4 SWEEPING EPIC WIDE (island / cosmic / river-tracking, vast vista)
- 4 OVERHEAD AERIAL (top-down on island or river or undersea)
- 4 ANT-PERSPECTIVE GROUND-LEVEL (microscopic / sugar-grain landscape ground-up)
- 4 SIDE-TRACKING (river-boat / undersea drift / orbiting space)
- 4 EXTREME WIDE COSMIC / VAST (deep-space cosmic / vast island vista)

━━━ EXAMPLES ━━━

"Low hero-up angle gazing dramatically upward at the colossal subject from below"
"Sweeping epic wide composition with vast depth and panoramic horizon"
"Overhead aerial composition looking straight down on the island or river surface"
"Ant-perspective ground-level framing with subject towering against the sky"
"Side-tracking composition moving alongside the subject in motion"
"Extreme wide cosmic composition with vast empty space and small subject"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
