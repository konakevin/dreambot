#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/water_conditions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WATER CONDITION descriptions for MermaidBot. Each entry describes how the water LOOKS and BEHAVES in this specific render — clarity, motion, light interaction, particles.

Each entry: 10-20 words. A specific water condition.

━━━ CATEGORIES TO COVER ━━━
- Crystal clear shallow water with caustic sunbeam patterns on white sand
- Deep blue open ocean with gentle swells and dappled light from above
- Murky green coastal water with suspended kelp particles and filtered light
- Black abyssal water lit only by bioluminescence and distant volcanic glow
- Turquoise tropical shallows with visible coral and dancing light ripples
- Storm-churned gray-green water with bubbles, debris, and chaotic refraction
- Moonlit silver surface water with calm mirror-like reflections
- Glacier meltwater, crystal blue-white, tiny ice crystals suspended
- Warm volcanic vent water with mineral shimmer and heat distortion
- Twilight zone water, deep indigo, last traces of surface light fading

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: water clarity + light source + motion state.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
