#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/deep_wonder.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT DEEP SEA BEAUTY descriptions for OceanBot. These are BEAUTIFUL and ALIEN — glowing, translucent, ethereal deep-sea creatures and phenomena. NOT scary — wondrous and mesmerizing.

Each entry: 15-25 words. One specific deep-sea wonder.

━━━ CATEGORIES (mix across all) ━━━
- Jellyfish trailing ribbons of electric blue light through black water
- Siphonophores stretching like glowing chains across the void
- Bioluminescent plankton clouds ignited by movement
- Translucent creatures with visible organs glowing from within
- Comb jellies refracting rainbow light along cilia rows
- Crystal-bodied shrimp with internal luminescence
- Deep-sea salps forming glowing colonial chains
- Pyrosomes — hollow tubes of living light drifting
- Sea angels with translucent wings pulsing blue
- Firefly squid swarms creating underwater star fields
- Atolla jellyfish alarm displays in deep darkness
- Deep-sea coral gardens with bioluminescent polyps

━━━ RULES ━━━
- BEAUTIFUL and ALIEN, never scary or horrifying
- Emphasize glow, translucence, ethereal quality
- Specific creatures and light behaviors, not generic "glowing things"
- No repeats — every entry a unique deep-sea wonder
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
