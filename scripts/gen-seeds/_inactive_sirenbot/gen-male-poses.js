#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/male_poses.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} candid FULL-BODY poses / stances for a menacing high-fantasy MALE warrior (orc warlord, dark knight, dragonborn, minotaur, etc. — race is a separate axis, don't pick one).

Each entry: 12-25 words describing what his body is DOING and how he stands/holds himself. Alpha, battle-scarred, lethal. Not posing — being.

━━━ EXAMPLES ━━━
- "planted heavy across both legs, shoulders squared, one gauntleted fist resting on a weapon's pommel"
- "kneeling on one knee in a field of carnage, head lowered, blade point driven into earth"
- "mid-stride through smoke, cloak streaming behind, one hand free and curled into a fist"

━━━ VARY ACROSS ENTRIES ━━━
- Stance (standing / kneeling / crouched / mid-stride / bracing / turning / seated on throne-like surface)
- Weight / grounding (heavy planted / loose and ready / coiled / centered / shifting)
- Hands (on hilt / folded / gripping / reaching / clenched)
- Head angle + intent

━━━ BANNED ━━━
- "posing" / "modeling" / "camera" / "editorial"
- No specific race, weapon, or setting (those are other axes)
- No specific props beyond body/stance

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
