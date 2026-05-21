#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_camera.json',
  total: 30,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} CAMERA COMPOSITIONS for YumBot rainbow-dreamscape. Wider scenic shots showing the kawaii cups IN the landscape.

Each entry: 12-22 words.

━━━ DISTRIBUTION ━━━

- 25% MID-WIDE EYE-LEVEL (mid-wide eye-level shot showing the kawaii cups nestled in the meadow with mountains behind)
- 20% WIDE-VISTA (wide-vista shot of the entire pastel-landscape with kawaii cups as inhabitants / wider establishing shot)
- 15% LOW-ANGLE LOOK-UP (low-angle from cup-level looking up at the rainbow sky)
- 15% 3/4 OVER-MEADOW (3/4 angle over the meadow looking down toward the kawaii cups and distant mountains)
- 10% MID-DISTANCE (mid-distance angle with the kawaii cups in middle-ground and landscape framing)
- 10% HIGH-VANTAGE (high-vantage looking down across the meadow showing scattered kawaii cup-inhabitants)
- 5% DUTCH-TILT-PASTEL (subtle playful pastel dutch-tilt composition)

━━━ HARD MANDATES ━━━

- Wider scenic feel
- Both landscape AND kawaii cups visible

━━━ HARD BANS ━━━

- NO tight close-ups of single cup
- NO tabletop-flatlay angles
- NO portrait crops

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
