#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/expressions.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FACIAL EXPRESSION descriptions for a dangerous high-fantasy warrior in a close-up portrait. Works for both male and female characters.

Each entry: 10-20 words describing what the FACE is doing — eyes, mouth, brow, jaw. The character is dangerous — every expression carries threat, calculation, or cold beauty.

━━━ MOODS TO MIX ━━━
- Fierce / defiant (bared teeth, snarl, jaw set)
- Cold / calculating (unblinking, half-lidded, bored even)
- Hungry / predatory (slight smile, tongue touching canine, eyes narrow)
- Contemptuous (lip curled, brow raised, dismissive)
- Ritual / focused (eyes half-closed, lips moving in incantation)
- Wounded-dangerous (blood at lip, eyes still sharp, unbroken)
- Battle-calm (deep stillness, eyes scanning)
- Amused-cruel (smile that doesn't reach the eyes)
- Glacial superiority (head tilted down, looking along nose)
- Mid-roar / mid-battlecry (mouth open, teeth bared, eyes wild)

━━━ BANNED ━━━
- "posing" / "modeling" / "camera"
- Specific race features (horns, scales, ears — those are race axis)
- Non-face elements (body, weapons, setting)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
