#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} OCEAN COLOR PALETTE descriptions for OceanBot. Each is a short color palette describing the dominant tones for an ocean scene rendering.

Each entry: 10-15 words. One specific ocean color palette.

━━━ CATEGORIES (mix across all) ━━━
- Deep navy blue with silver highlights and white foam accents
- Turquoise and teal with sandy gold undertones
- Midnight blue and black with bioluminescent blue-green sparks
- Coral pink and warm turquoise with white sand reflections
- Storm grey and dark green with white spray highlights
- Emerald green and deep blue with dappled gold sunlight
- Silver and pewter with pale blue-grey horizon
- Molten gold and copper sunset on dark blue water
- Ice blue and white with deep cobalt shadows
- Tropical gradient — pale aqua to deep sapphire
- Blood orange sunset with silhouetted dark ocean
- Muted teal and sage with overcast pearl-grey sky

━━━ RULES ━━━
- COLOR PALETTES only — 3-5 colors/tones per entry
- Ocean-specific — every palette should feel like water
- Describe colors with specificity (not just "blue" — navy, cobalt, cerulean, teal)
- No repeats — every entry a unique ocean palette
- Concise, evocative language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
