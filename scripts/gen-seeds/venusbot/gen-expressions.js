#!/usr/bin/env node
/**
 * Generate 50 EXPRESSIONS for VenusBot — micro facial/gaze descriptions.
 *
 * Used in closeup path. Each is 10-20 words describing what her FACE is
 * doing — mouth, eyes, micro-movements, subtext. Seductive surface hiding
 * cold calculation underneath ("bait and blade").
 *
 * Output: scripts/bots/venusbot/seeds/expressions.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/expressions.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} expression/gaze descriptions for a cyborg-assassin woman. Each describes what her FACE is doing in a tight close-up — mouth, eyes, lips, micro-tells.

━━━ CHARACTER VIBE ━━━

She's a honeytrap predator. Beautiful, exquisite, cold. The surface reads sexy/seductive; the eyes stay clinical and calculating. Bait and blade. "Smile that does not reach the eyes."

━━━ CONTENT ━━━

Each entry is 12-20 words. Vary widely across:
- Mood: amused, bored, hungry, assessing, distracted, contemplating, faintly warm, intensely focused, calculating, mock-curious, unreadable
- Mouth: parted, pressed, half-smile, smirk, soft, tight, barely-breathing, mid-exhale
- Eyes: unblinking, half-lidded, sharp, narrowed, glazed, tracking, veiled, reading, disengaged

━━━ BANNED ━━━

No "pose", no "poses for camera", no "confident model stance". No cigarettes/drinks/props (those are OTHER axes). Describe the FACE only — nothing about body, setting, props.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
