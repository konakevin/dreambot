#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/deep_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DEEP-SEA SETTING descriptions for MermaidBot's mermaid-deep path. Abyssal environments — total darkness lit only by bioluminescence, volcanic vents, crushing-depth architecture.

Each entry: 10-20 words. A specific deep-sea environment.

━━━ CATEGORIES TO COVER ━━━
- Hydrothermal vent field with mineral chimneys billowing superheated clouds
- Abyssal trench wall with bioluminescent organisms clinging to sheer rock
- Deep-sea coral garden of glass sponges and tube worms
- Sunken city ruins on the ocean floor, encrusted and ancient
- Bioluminescent jellyfish cloud drifting through total darkness
- Whale-fall ecosystem, massive skeleton colonized by deep-sea life
- Volcanic fissure glowing orange through black basalt
- Manganese nodule field stretching into infinite darkness
- Deep-sea cave system with crystal formations and still black water
- Abyssal plain with scattered bioluminescent sea pens and brittle stars

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: geological feature + light source type.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
