#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for StarBot's cyborg-woman path. Each describes what the cyborg is DOING when the camera catches her — a dynamic freeze-frame moment, NOT a static pose.

Each entry: 10-18 words. One specific action caught mid-motion.

━━━ ABSOLUTE RULE — FEET ON THE GROUND ━━━
Her feet MUST be on a solid surface in every single entry. She is NEVER floating, jumping, mid-air, levitating, hovering, falling, dissolving, or defying gravity. Both feet planted or one foot forward mid-stride — ALWAYS grounded.

━━━ BANNED ACTIONS (never use) ━━━
- NO jumping, leaping, mid-air, landing from height, vaulting
- NO floating, hovering, levitating, defying gravity
- NO dissolving, teleporting, phasing through things
- NO squatting, crouching, kneeling
- NO sitting, reclining, lying down
- NO meditating, watching, staring, gazing
- NO standing still facing camera
- NO posing, modeling, strutting
- NO climbing walls or vertical surfaces

━━━ GOOD ACTION CATEGORIES (spread across all) ━━━
- Walking through an environment (rain-slicked street, burning corridor, alien ruins)
- Reaching for something (a holographic interface, a weapon, a door mechanism)
- Turning to look over her shoulder mid-stride
- Catching something thrown — hand snapping out, servo fingers closing
- Repairing herself — one arm open, tools in the other hand
- Stepping through a doorway / threshold
- Picking up / examining an object with articulated fingers
- Leaning against a wall, one foot up, scanning the street
- Drawing / holstering a weapon mid-motion
- Running across a street or corridor, hair streaming
- Emerging from smoke / steam / wreckage (feet on ground)
- Touching a surface and it reacting to her (circuits spreading, ice forming, metal warping)
- Pulling cables from her own arm for a repair or hack
- Pushing through a crowd or obstacle
- Striding confidently down a corridor or alley

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: verb (no two entries with same primary action) + body engagement (upper body / lower body / full body / hands-focused)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
