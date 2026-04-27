#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/skin_tones.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SKIN TONE descriptions for GothBot's character paths. Each entry is a SHORT phrase (4-10 words) describing ONLY a specific skin tone/texture. Shared across male AND female gothic-horror characters. Dark fantasy — some tones are natural, some are supernatural.

━━━ TONE SPREAD (enforce even distribution across ${n}) ━━━
- PALE / VAMPIRIC (4-5) — porcelain-pale, translucent corpse-white with visible blue veins, ash-grey pallor, moon-pale with violet undertone
- WARM BROWN (4-5) — deep umber, warm bronze, rich mahogany, copper-brown, tawny
- OLIVE / MEDITERRANEAN (2-3) — warm olive, sun-darkened olive, golden-olive
- DARK / DEEP (4-5) — onyx-dark, deep espresso, dark-umber, blue-black deep, rich obsidian
- SUPERNATURAL (3-4) — blue-tinged cadaver pallor, moonlit-violet tinge, ash-grey with glowing veins, frost-white
- WEATHERED / TEXTURED (2-3) — sun-leathered bronze, battle-scarred copper, wind-burned ruddy

━━━ RULES ━━━
- ONLY skin tone and texture — no facial features, no build, no clothing
- Can include texture details ("with visible veins", "scarred", "pore-level detail")
- Mix natural human diversity with gothic-supernatural variations
- Respectful — these are beautiful dark-fantasy characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
