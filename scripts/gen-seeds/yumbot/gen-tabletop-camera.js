#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_camera.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} CAMERA COMPOSITIONS for YumBot checkered-tabletop.

Each entry: 12-22 words.

━━━ DISTRIBUTION ━━━

- 35% 3/4 TABLETOP (3/4-angle from above-tabletop showing the hero + scattered minis + tablecloth pattern / 45-degree-angle tabletop view)
- 30% OVERHEAD FLATLAY (top-down flatlay showing the entire arranged tableau like a sticker-card / bird's-eye-view flatlay)
- 15% MID-WIDE CENTERED (mid-wide centered shot with hero centered on the tablecloth and scattered minis in foreground)
- 10% CLOSE-UP DETAIL (intimate close-up emphasizing the hero with mini-creature pile on top, scattered minis softly bokeh'd)
- 5% LOW-ANGLE (low-angle from tablecloth-level looking up at the hero making it monumental)
- 5% DUTCH-TILT-PASTEL (playful subtle tilt for whimsy)

━━━ HARD MANDATES ━━━

- TABLETOP / OVERHEAD focus
- Both hero AND scattered minis + tablecloth pattern visible

━━━ HARD BANS ━━━

- NO outdoor / scenic angles
- NO portrait crop

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
