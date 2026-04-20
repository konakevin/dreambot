#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/female_poses.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} candid FULL-BODY poses / stances for a dangerous high-fantasy WOMAN warrior (elf, orc, tiefling, drow, centaur, etc. — race is a separate axis, don't pick one here).

Each entry: 12-25 words describing what her body is DOING and how she stands/holds herself. Fierce, sexy, dangerous. Not posing for a camera — being in her world.

━━━ EXAMPLES OF GOOD ENTRIES ━━━
- "one hand resting on the pommel of a sheathed blade at her hip, weight loose, shoulders rolled back, chin lifted"
- "crouched low on a mossy stone, one hand pressed to the ground, fingers splayed, muscles coiled"
- "standing at the edge of a precipice, cloak snapping in wind, arms folded, head turned in profile"

━━━ VARY ACROSS ENTRIES ━━━
- Stance (standing / crouched / reclining / kneeling / mid-stride / perched / braced)
- Hand position (on weapon / on hip / reaching / resting / clenched / at throat)
- Weight distribution (forward / back / shifted onto one hip / low-centered)
- Head angle (chin lifted / lowered / turned / glancing back / gazing down)

━━━ BANNED ━━━
- "posing" / "modeling" / "camera" / "editorial" / "fashion shoot"
- Do NOT reference a specific race, weapon, or setting (other axes)
- Do NOT include specific props (belongs in OTHER axes) — just body/stance

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
