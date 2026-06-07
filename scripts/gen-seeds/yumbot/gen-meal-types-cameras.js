#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot meal-types renders. Each entry is one specific framing direction — focal length implied by intimacy, angle, distance, what fills the frame.

Each entry: 12-22 words. ONE specific framing direction.

━━━ DISTRIBUTION ━━━

- 5 OVERHEAD compositions (full top-down flat-lay / 3/4 overhead lean)
- 5 STRAIGHT-ON / EYE-LEVEL portraits (kawaii subject centered, narrow depth)
- 5 LOW-ANGLE / HERO-UP (looking up at the subject, dramatic compact)
- 4 OFF-CENTER COMPOSITIONS (rule-of-thirds, negative space on one side)
- 3 EXTREME MACRO (very close, single kawaii feature dominating frame)
- 3 WIDE TABLE-WIDE (multiple subjects, full setting visible)

━━━ EXAMPLES ━━━

"Overhead flat-lay framing, subject centered, surrounding decor radiating outward in symmetrical balance"
"Eye-level intimate portrait, subject filling 60 percent of frame, gentle 3-quarter rotation revealing one cheek"
"Low hero-up angle gazing upward at the subject from below, slight tilt giving monumental presence"
"Off-center composition with subject in left third, negative space and decor breathing on the right"
"Extreme macro on the kawaii smile, eyes and dot-blush filling most of the frame, edges soft"
"Wide table-wide framing showing multiple subjects with full setting context visible"

━━━ HARD BANS ━━━

- NO mention of specific cameras, lenses, focal-length numbers (50mm / 85mm / etc.)
- NO photographer name-drops
- NO lighting / palette / time-of-day language (those are other axes)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
