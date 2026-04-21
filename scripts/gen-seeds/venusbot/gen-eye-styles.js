#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/eye_styles.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EYE style descriptions for a cyborg-assassin woman. Each describes the COLOR + QUALITY of her eyes. Surreal / sci-fi / plasma / mechanical-iris aesthetic.

Each entry: 8-16 words. Name color + quality + any unique feature.

━━━ MIX ACROSS ━━━
- Plasma colors (violet / cyan / amber / crimson / magenta / toxic green / sapphire / gold / silver)
- Iris structure (triple irises / mechanical shutter / concentric rings / fractal geometry / no pupil + full glow)
- Quality (luminous / radiant / blazing / glowing / burning / shimmering / electric / molten / crystalline / holographic)
- Special features (data streams visible / nebula reflection / hologram iris / neural threading / fiber-optic depth / iris that shifts color)
- Dual-eye variants (heterochromia — one plasma, one human; or glowing left + mechanical right)

━━━ BANNED ━━━
- Plain "blue eyes" / "brown eyes" — always cyborg-stylized
- "posing" language
- Face features other than eyes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
