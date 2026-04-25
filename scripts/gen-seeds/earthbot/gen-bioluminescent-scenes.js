#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/bioluminescent_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT / PANDORA-STYLE GLOWING LANDSCAPE descriptions for EarthBot — otherworldly luminous natural scenes that feel like Avatar's Pandora brought to Earth.

Each entry: 15-25 words. One specific glowing landscape scene. No people, no animals as subjects.

━━━ CATEGORIES (mix across all) ━━━
- Glowing moss carpets (bioluminescent moss blanketing forest floors, green-glow root systems)
- Luminous lakes and shores (dinoflagellate bays, glowing plankton waves, neon tide lines)
- Crystalline forests (crystal-encrusted trees catching moonlight, prismatic ice forests)
- Bioluminescent mushroom groves (clusters of glowing fungi on ancient logs, fairy-ring glow)
- Neon algae rivers (fluorescent algae streams, glowing creek beds, luminous waterfall pools)
- Firefly-filled meadows (thousands of fireflies in forest clearings, synchronized firefly drifts)
- Glowing cave systems (cave walls with bioluminescent bacteria, glow-worm grottos)
- Luminous coral landscapes (shallow reef glow, fluorescent coral gardens under UV moonlight)
- Phosphorescent fog (glowing mist rolling through valleys, luminous ground fog in forests)
- Glowing root networks (mycelium glow visible through soil, connected tree root light webs)
- Aurora-lit ice with glow (northern lights reflecting off bioluminescent snow melt)
- Enchanted pools (still forest pools with glowing bottom sediment, luminous hot springs)

━━━ RULES ━━━
- GLOW and LUMINESCENCE are the star — every scene must have self-generating light
- Mix real bioluminescence with amplified/fantastical glow for maximum visual impact
- Variety of glow colors: blue, green, cyan, purple, warm amber, not just blue
- Landscapes only — no creature subjects, no people
- No two entries should describe the same glow source in the same setting
- 15-25 words each — ethereal, magical, immersive language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
