#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_camera_angle.json',
  total: 60,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA-ANGLE compositions for ChibiBot miniature-feast — how the chibi + food + scene is framed. Pop-Mart kawaii register.

Each entry: 12-25 words. ONE specific camera framing.

━━━ DISTRIBUTION ━━━

- 25% OVERHEAD FLATLAY (overhead top-down view of the whole kawaii table-spread, food hero centered, chibis arranged around it like a Pop-Mart flatlay shot / bird's-eye-view of a kawaii afternoon-tea setup)
- 25% MID-WIDE CAFÉ TABLE (mid-wide three-quarter view of the kawaii café table with the food hero centered and chibis seated around it / mid-wide of the picnic blanket with food and chibis arranged)
- 20% CLOSE-ON-FOOD WITH CHIBIS PEEKING (close framing on the kawaii food hero with chibis peeking from behind, beside, or above — they pop into frame around the food / chibis peering up at the giant food)
- 15% 3/4-TABLETOP HEIGHT (camera at chibi eye-level looking across the tabletop with food hero centered and chibis as midground / 45-degree-tabletop kawaii café view)
- 10% LOW-ANGLE LOOK-UP (low chibi-level looking up at the giant food hero with chibis tiny in foreground / worm's-eye-view of the giant kawaii food)
- 5% DUTCH-PASTEL (slight tilted-pastel angle for whimsical playful kawaii composition)

━━━ HARD MANDATES ━━━

- Camera angle MUST show BOTH the kawaii food hero AND the chibi(s)
- Pop-Mart designer-vinyl flatlay-photo or pop-up-book composition register
- ALWAYS visually balanced (not a portrait of just chibi OR just food)

━━━ HARD BANS ━━━

- NO portrait crops of just chibi
- NO macro-of-only-food
- NO dark / moody / dramatic angles

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
