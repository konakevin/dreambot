#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/big_waves.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MONSTER WAVE descriptions for OceanBot. 40-60 foot walls of water, raw wave power and beauty at Nazaré/Mavericks/Teahupo'o/Pipeline scale. NO surfers — just the waves themselves.

Each entry: 15-25 words. One specific giant wave moment.

━━━ CATEGORIES (mix across all) ━━━
- 50-foot wall of dark green water with spray tearing off the lip in offshore wind
- Barrel interior lit by morning sun, cathedral of curling water
- Mountains of whitewater avalanching down a wave face after it breaks
- Nazaré-scale wave stacking up over deep canyon, impossibly tall
- Teahupo'o-style thick slab breaking over shallow reef, water detonating
- Pipeline-style tube with light filtering through the falling curtain
- Mavericks cold-water giant, dark grey-green face streaked with foam
- Backlit wave with sun shining through the translucent face
- Cross-wave collision creating a pyramid of exploding water
- Closeout set wave detonating across an entire bay
- Wave lip throwing forward with the power of a building collapsing
- Open ocean swell — clean unbroken lines marching to the horizon

━━━ RULES ━━━
- NO surfers — just raw wave power and beauty
- SCALE — these are building-sized waves, emphasize height and mass
- Specific wave anatomy (lip, face, barrel, foam, spray, swell)
- No repeats — every entry a unique wave moment
- Vivid, visceral language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
