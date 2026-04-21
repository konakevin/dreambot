#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/body_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BODY TYPE / SILHOUETTE descriptions for a cyborg-assassin woman. Each describes her overall build so the render doesn't default to runway-thin. North star: ALWAYS sexy, ALWAYS R-rated, always fuckable.

Each entry: 15-30 words. Specific about bust, waist, hips, height, muscle definition.

━━━ MIX WIDELY ACROSS ━━━
- Voluptuous / bombshell (hourglass, big bust, narrow waist, wide hips)
- Stacked (enormous bust, cinched waist, lush curvy hips — dramatic hourglass)
- Thick curvy athletic (broad shoulders, strong thighs, full chest, soft stomach)
- Amazonian (tall 6-foot+, long legs, athletic, firm full bust)
- Petite (short 5-foot frame, compact curves, generous bust for size)
- Lean runway (long limbs, subtle curves, small firm bust)
- Pear-shaped (small-medium bust, wide voluptuous hips + thick thighs)
- Apple-shaped (full chest + shoulders, soft midsection, slimmer legs)
- Athletic curvy (visible muscle under soft skin, sculpted mechanical abs)
- Slim-thicc (slender waist + shoulders, unexpectedly thick hips + thighs)
- Tall willowy (flat-chested with subtle shaping, narrow hips, long limbs — androgynous)
- Plus-size voluptuous (fully curvy, soft full bust, rounded hips + thighs)
- Muscle-queen (gym-goddess, visible abs + biceps, still curvy + full-busted)
- Dancer (lean + toned, small-medium bust, long neck + legs)

━━━ RULES ━━━
- Every entry is R-rated sexy — no exceptions
- Mix heights (5'0"-6'5") + builds + bust sizes + hip widths
- Include "mechanical" / "cyborg" language ONLY when referring to augmented parts
- Each entry names an ALL-TOGETHER silhouette, not just one attribute

━━━ BANNED ━━━
- "posing" / "modeling"
- Body-shaming language
- Inch marks or foot marks inside strings (no 5'5" or 6'2" — use "five-foot-five" or "six-foot-two" to keep JSON valid)
- Any unescaped double-quotes inside entries

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
