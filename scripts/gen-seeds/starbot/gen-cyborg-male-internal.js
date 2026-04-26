#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_male_internal.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CYBORG INTERNAL EXPOSURE descriptions for a male cyborg character. Each describes ONE visible translucent or open section of his body where you can see the mechanical workings inside.

Each entry: 15-25 words. One specific internal-reveal detail. Use "his/he" pronouns.

━━━ CATEGORIES (spread across all) ━━━
- Translucent skin section (torso, forearm, temple) showing gears/circuits/core through clear polymer
- Open maintenance panel (cheek, forehead, collarbone) revealing cables and mechanisms
- Service seam (jaw, neck, spine) partially open showing fiber-optic bundles
- Mechanical eye aperture with visible servos and focus rings
- Glass observation window (neck, sternum) showing rotating vertebrae or reactor
- Open chrome ribcage/latticework showing power core within
- Diagnostic port with plasma wisps and spilling filaments
- Transparent acrylic forearms/hands showing every tendon-cable and hydraulic line

━━━ RULES ━━━
- Always use "his/he" pronouns
- Physical mechanical detail only — what you SEE, not what it means
- Each entry = one specific body location + what's visible inside
- Mix materials: brass gears, chrome structure, fiber-optic cables, plasma conduits, acrylic panels, polymer skin

━━━ DEDUP ━━━
No two entries should describe the same body location with the same type of reveal.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
