#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot narrative-action renders. Each entry is one framing tuned for action / story moments (baking-in-progress / harvest / shop-window / parade / tea-party / delivery).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 SIDE-ON ACTION (tracking the action mid-motion, parade or delivery)
- 4 OVERHEAD AERIAL (top-down baking counter or tea table)
- 4 THREE-QUARTER LEAN (mid-action moment with depth)
- 4 OFF-CENTER ACTION (subject in motion across the frame, negative space leading)
- 4 LOW HERO-UP (looking up at the kawaii subject mid-action)
- 5 INTIMATE STORY (mid-action close-up, emotional moment)

━━━ EXAMPLES ━━━

"Side-on tracking framing with the subject in mid-motion, slight motion-blur tail behind"
"Overhead aerial framing of the counter / table, action arrayed below"
"Three-quarter lean revealing depth, kawaii subject mid-action at center"
"Off-center action with subject crossing into the frame from one side, leading negative space"
"Low hero-up angle gazing up at the kawaii subject mid-action"
"Intimate close-up on the kawaii subject's mid-action expression"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
