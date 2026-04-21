#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/hair_styles.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} HAIR descriptions for a cyborg-assassin woman. Each names the color, texture, and styling of her hair. Surreal / cyberpunk / sci-fi hair — defies gravity, glows, shimmers, fiber-optic, crystalline, plasma, liquid metal.

Each entry: 8-16 words.

━━━ MIX ACROSS ━━━
- Texture (braided / flowing / streaming / tendrils / spiked / coiled / dreadlocked / cropped / shorn / slicked / wet / windswept / suspended)
- Material (natural / fiber-optic / crystalline / plasma / liquid mercury / holographic / nanotube / iridescent / gossamer / living / molten)
- Color (platinum / obsidian / electric teal / violet / molten copper / crimson / ice-white / chrome / prismatic / emerald / amber / magenta)
- Motion (gravity-defying / floating / suspended / flowing / wind-caught / static / streaming upward)
- Length (short crop / shoulder / long / floor-length / cascading)

━━━ BANNED ━━━
- Generic "brown hair" / "blonde hair" — always specific + stylized
- "posing for camera"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
