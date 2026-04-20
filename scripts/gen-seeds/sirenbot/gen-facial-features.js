#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/facial_features.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} distinctive MAGICAL FACIAL FEATURE descriptions for a fantasy warrior. Each is a striking detail visible in a closeup portrait — glowing eyes, magical markings, scars-with-stories, or race-signature feature.

Each entry: 8-18 words. One feature per entry.

━━━ CATEGORIES TO MIX ━━━
- Glowing eye colors (molten gold, amethyst, crimson ember, toxic green, moonlit silver, void-black with starlight pupils)
- Magical markings (runic tattoos across cheek, glyphs glowing faintly, rune-ink along jaw)
- Scars with character (ritual scars, claw marks, rune-branded scars, dueling scars)
- Skin-level magic (faint glow under skin, iridescent pattern, cracked-light skin showing inner fire)
- Natural features enhanced (pointed ears with gem studs, horns with inlaid metal, tusk tips with jeweled caps)
- Unusual pupils / irises (slit dragon pupils, cat-eyes, crystalline iris, no-pupil glow)
- Magical marks (third eye on forehead, brand over heart, sacred geometry etched into brow)
- Ornamental scars / piercings (jeweled brow ring, septum ring, ear-chains)
- Tear-like effects (tears of mercury, crystal tears, flame-tracks down cheek)
- Hair-to-face integration (hair beginning to glow at scalp, vines growing from temples, flames for hair edge)

━━━ BANNED ━━━
- "posing" / "modeling"
- Race-specific features (horns etc. for tieflings, ears for elves — those are implied by race axis)
- Body-level features — this is FACE ONLY

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
