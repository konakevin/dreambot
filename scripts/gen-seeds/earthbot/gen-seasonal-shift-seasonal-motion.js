#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — SEASONAL MOTION axis (R4 autumn + spring only).
 *
 * The captured-moment accent — leaves spinning, blossoms drifting,
 * petals falling. Season-tagged autumn or spring ONLY.
 *
 * R0 = 30.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_seasonal_motion.json';
// Append mode — scale R6 30-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SEASONAL MOTION entries for EarthBot seasonal-shift. Each entry names ONE moment-in-motion accent — a specific captured-instant action that makes the frame feel alive.

━━━ THE BAR — ONE CAPTURED-MOMENT MOTION ━━━

A single specific motion. The frame is one beat in time.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<one captured motion, 14-22 words>" }

Season tag MUST be the FIRST tag — ONLY "autumn" or "spring".

━━━ AUTUMN MOTION (~50%) ━━━

- A scattering of fallen leaves drifting through the air in a soft autumn breeze
- A single leaf spinning slowly down through the air mid-fall
- A drift of autumn leaves spiraling on a soft wind crossing the slope
- A mid-fall maple leaf caught spinning in golden afternoon light
- Loose autumn leaves blowing across the forest floor in chaotic drift
- A flock of geese flying overhead in V-formation across the autumn sky
- A few snowflakes drifting down through the autumn canopy in soft first-snow flurry
- A scatter of leaves with first-snow dust drifting through the air together
- A single leaf caught mid-spin against a snow-dusted slope behind
- A drift of leaves landing softly on a snow-dusted forest floor
- Fresh snow flurry drifting through the still-leafy canopy at first snow

━━━ SPRING MOTION (~50%) ━━━

- A drift of cherry blossoms cascading on a soft spring breeze
- Wildflower petals shifting in a soft warm breeze across the meadow
- A scattering of cherry-blossom petals carpeting the foreground in still drift
- A drift of blossoms whirling on a soft breeze across the pond surface
- A pair of butterflies fluttering between blossoms at the foreground
- A few petals drifting downward in soft warm light
- A swirl of mixed petals (cherry, magnolia, redbud) drifting on a soft spring breeze
- A small bee hovering at a peak-bloom flower at the foreground
- A flock of small spring birds darting between blossoming trees
- A few green new leaves unfurling on a fresh spring branch
- A wildflower meadow with stems swaying in a soft warm spring breeze
- A drift of forsythia petals carried across the foreground on a gentle breeze

━━━ ABSOLUTELY BANNED ━━━

- Multiple motions per entry (ONE only)
- Color details (color_palette axis)
- Depth tier details (depth_layers axis)
- Subject content (subject axis)
- Lighting / sky / atmosphere
- Architecture / humans
- Sci-fi / fantasy

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. ONE captured motion per entry. Season-tagged. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
