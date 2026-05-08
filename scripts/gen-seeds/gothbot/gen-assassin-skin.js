#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_skin.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN SKIN descriptions for GothBot's vampire-assassin paths (gender-neutral — used for both male and female assassins). Each entry is 14-22 words.

CONTEXT: These are HOT, ornate, agile, crafty vampire-assassins — Castlevania + Devil May Cry + Van Helsing energy. Beautiful and dangerous in equal measure. NOT weathered grizzled hunters — sleek deadly predators with high-fashion-villain pallor.

EVERY entry must include:
- Pallor / undertone (alabaster, ivory, marble, ash-pale, milk-pale, ice-pale, faintly-bronzed-pale — all reading as STRIKING and beautiful, not sickly)
- ONE elegant subtle detail (faint silver-cross-shaped scar at the temple / a single faded sigil-tattoo at the collarbone / a thin elegant scar tracing the jaw / a small crescent-moon birthmark below the eye / faint vein-traces at the temple from holy-magic exposure / a discreet sigil-brand at the wrist / a fine pale scar bisecting an eyebrow). Subtle, never disfiguring.
- Ethnic variety discreet (European, Eastern-European, Mediterranean, Asian, Slavic, Nordic, Persian) — pallor constant, ethnic features the variable

ABSOLUTELY NEVER: weathered / aged / haggard / grizzled / pockmarked / scar-covered / heavy bruising / blemished. These are HOT.

Examples (write fresh):
- "alabaster pale catching cold moonlight, a thin elegant scar tracing the jawline, high cheekbones sharpened by the contrast"
- "ivory marble pallor with a single silver-cross-shaped scar at the right temple, Eastern-European bone structure beneath"
- "ice-pale with faint vein-traces at the temples from holy-magic exposure, sculpted Slavic cheekbones"
- "milk-pale with a small crescent-moon birthmark below the left eye, refined Mediterranean features"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
