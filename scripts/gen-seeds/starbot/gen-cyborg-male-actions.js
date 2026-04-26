#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_male_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for StarBot's cyborg-man path. Each describes what the cyborg is DOING when the camera catches him — a dynamic freeze-frame moment, NOT a static pose. He is a cold, dangerous operative — every action radiates lethal precision.

Each entry: 10-18 words. One specific action caught mid-motion. Use "He" pronouns.

━━━ ABSOLUTE RULE — FEET ON THE GROUND ━━━
His feet MUST be on a solid surface in every single entry. He is NEVER floating, jumping, mid-air, levitating, hovering, falling, dissolving, or defying gravity. Both feet planted or one foot forward mid-stride — ALWAYS grounded.

━━━ BANNED ACTIONS (never use) ━━━
- NO jumping, leaping, mid-air, landing from height, vaulting
- NO floating, hovering, levitating, defying gravity
- NO dissolving, teleporting, phasing through things
- NO squatting, crouching, kneeling
- NO sitting, reclining, lying down
- NO meditating, watching, staring, gazing
- NO standing still facing camera
- NO posing, modeling, flexing for the viewer

━━━ HARD CAP — MAX 2 WALKING/STRIDING ENTRIES ━━━
No more than 2 entries total may involve walking, striding, or stepping through anything. The other 23 entries MUST be non-locomotion actions.

━━━ GOOD ACTION CATEGORIES (spread EVENLY — minimum 2 per category) ━━━
- Reaching for something (holographic interface, weapon, kill switch, door mechanism)
- Catching something mid-air — hand snapping out, servo fingers closing
- Field-repairing himself — forearm panel open, recalibrating circuits
- Examining / inspecting an object with articulated fingers
- Drawing / holstering a weapon
- Crushing something in his grip, sparks flying
- Pulling data from a terminal, servo hand precise
- Shouldering through a barrier, hydraulics straining
- Turning sharply to scan for threats behind him
- Lighting something, face lit by ember glow
- Leaning against a wall, scanning the environment
- Bracing against an explosion or shockwave
- Catching a blade or projectile bare-handed
- Ripping open a panel or hatch with mechanical force
- Plugging into a system via wrist port, data streaming
- Deflecting an attack, sparks showering off mechanical forearm

━━━ DEDUP ━━━
Deduplicate by: action verb. No two entries should use the same core verb (walks/strides/steps count as one verb).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
