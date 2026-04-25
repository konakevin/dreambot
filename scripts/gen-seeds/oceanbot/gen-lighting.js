#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} OCEAN-SPECIFIC LIGHTING descriptions for OceanBot. How light interacts with water at various depths, times, and weather conditions. These are lighting directions, not scenes.

Each entry: 15-25 words. One specific lighting condition.

━━━ CATEGORIES (mix across all) ━━━
- Caustic light patterns dancing across sandy bottom in shallow water
- Filtered blue-green light at 60 feet with sun visible as bright disc above
- Golden hour light on wave faces, warm tones through translucent water
- Moonpath on ocean swells, silver light stretching to horizon
- Storm-break light — dramatic sun rays piercing through dark cloud gaps onto water
- Crepuscular rays underwater — god beams streaming down through surface
- Bioluminescent glow as sole light source in abyssal darkness
- Dappled light through surface chop creating moving patterns on reef
- Green flash moment at sunset where sky meets flat ocean
- Overcast flat light turning ocean to burnished pewter
- Split-light at waterline — warm above, cool blue-green below
- Deep twilight zone light — last traces of surface sun at 600 feet

━━━ RULES ━━━
- LIGHTING ONLY — how light behaves with water, not creatures or scenes
- Specific depth, time, weather, and water conditions that affect the light
- Technical but beautiful — these are lighting directions for rendering
- No repeats — every entry a unique light interaction
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
