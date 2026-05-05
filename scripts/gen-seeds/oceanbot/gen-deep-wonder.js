#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/deep_wonder.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT DEEP SEA BEAUTY descriptions for OceanBot — BLOWN UP to AI-impossible levels. These are BEAUTIFUL and ALIEN — glowing, translucent, ethereal deep-sea creatures and phenomena, compounded with stacked extreme phenomena. NOT scary — wondrous and mesmerizing.

Each entry: 28-40 words. One specific deep-sea wonder with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Jellyfish trailing electric-blue light through black water + plankton-storm of glowing motes + cathedral-scale void
- Siphonophores stretching like glowing chains across the void + bioluminescent abyssal glow below + caustic shafts above
- Bioluminescent plankton clouds ignited by movement + glowing fluorescent coral spires + caustic-net light from surface
- Translucent creatures with visible organs + multi-color glow + impossible color stacking + suspended marine snow thick
- Comb jellies refracting rainbow light + skyscraper-scale coral around them + abyssal glow below
- Crystal-bodied shrimp + internal luminescence + cathedral-scale rock formation + bioluminescent foreground
- Deep-sea salps forming glowing colonial chains + multi-color glow stacking + caustic light filtering down
- Pyrosomes — hollow tubes of living light + suspended marine-snow thick + bioluminescent abyssal floor
- Sea angels with translucent wings pulsing blue + stacked light sources from surface + glowing coral spires
- Firefly squid swarms creating underwater star field + galaxy-like density + multi-color bioluminescence
- Atolla jellyfish alarm display + impossible color stacking + cathedral-scale void around it
- Deep-sea coral gardens with bioluminescent polyps + caustic shafts piercing from surface + glowing fish schools
- Whale-fall garden ancient skeleton blooming with alien gardens + multi-color bioluminescence + plankton-thick water
- Volcanic-vent cathedral + 50m black smokers + chemosynthetic gardens glowing + magma-glass curtains

━━━ RULES ━━━
- BEAUTIFUL and ALIEN, never scary or horrifying
- Emphasize glow, translucence, ethereal quality compounded with AI-impossible scale and color stacking
- 3+ stacked extreme phenomena per entry
- Specific creatures and light behaviors, not generic "glowing things"
- No repeats — every entry a unique deep-sea wonder
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
