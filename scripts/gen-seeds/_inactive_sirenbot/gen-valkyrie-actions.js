#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/valkyrie_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} VALKYRIE ACTION descriptions for SirenBot's valkyrie path. Each entry is what a winged warrior goddess is DOING — divine duties, battle, flight, guardianship. Unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific warrior-goddess action.

━━━ CATEGORIES TO COVER ━━━
- Descending from the sky with wings spread wide, spear aimed downward
- Pulling a glowing rune-sword from a stone altar, divine light erupting
- Landing hard on a battlefield, one knee down, wings folding, impact crater
- Sharpening a legendary blade on a divine whetstone, sparks flying golden
- Standing at the edge of a cliff, wings half-extended, scanning the valley
- Hurling a spear that trails divine fire through a stormy sky
- Kneeling to touch a fallen warrior's forehead, golden light transferring
- Striding through Valhalla's great hall, warriors parting before her
- Mounting a winged horse mid-gallop, swinging into the saddle
- Raising her shield against a blast of elemental energy, holding firm
- Unfurling her wings for the first time after a long ground patrol
- Catching a thrown weapon mid-flight and redirecting it with a spin

━━━ BANNED ━━━
- Sitting / resting passively / meditating
- "Posing", "modeling", looking at the camera
- Second warriors/enemies visible in frame

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + weapon/wings involvement.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
