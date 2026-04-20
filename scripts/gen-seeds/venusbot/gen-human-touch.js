#!/usr/bin/env node
/**
 * Generate 30 HUMAN TOUCH variants for the ROBOT path. She is 90%
 * machine, 10% human — each entry specifies which small human sliver
 * remains. Narrower pool since robot-path is only one of many paths.
 *
 * Output: scripts/bots/venusbot/seeds/human_touch_variants.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/human_touch_variants.json',
  total: 30,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} HUMAN-TOUCH variants for a ROBOT path where the subject is 90% machine and exactly 10% human. Each entry describes WHICH small human feature remains and what the rest of her looks like (machine).

━━━ WHAT MAKES A GOOD ENTRY ━━━

- Names EXACTLY what human feature remains (face half, lower lip, eyes only, one arm, throat-seam, hair, etc.)
- Describes it with a specific quality (real skin, pores visible, real eyelashes, full lips, warm tone)
- Contrasts with the machine rest (sculpted chrome mannequin shell, faceless helmet with visor, exposed endoskeleton, built-composite limbs)
- Feels uncanny — the human detail makes her MORE unsettling, not less

━━━ VARIETY ━━━

Mix which part is human:
- Face slivers (half face diagonally, lower face only, mouth + eyes, only lips, only eyes, only a seam)
- Body slivers (one arm, torso side-seam, throat, single finger, midriff stripe)
- Surface slivers (hair only, skin-patch over implant)
- Head slivers (jawline only, temple, one ear)

━━━ CONTENT ━━━

Each entry is 25-40 words. Specific about WHERE + WHAT QUALITY the human sliver has + what the machine majority looks like.

━━━ BANNED ━━━

- No entries where she's majority human (this path is 90% machine)
- No "posing"/"editorial" language
- No two human features — exactly ONE human sliver per entry

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 3000,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
