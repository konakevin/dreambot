#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/reef_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TROPICAL REEF SETTING descriptions for MermaidBot's mermaid-reef path. Bright, warm, colorful coral reef environments with sunbeam caustics and crystal-clear water.

Each entry: 10-20 words. A specific reef environment.

━━━ CATEGORIES TO COVER ━━━
- Massive brain coral formation with schools of angelfish and surgeon fish
- Coral archway tunnel with sunbeams streaming through gaps above
- Sea anemone garden with clownfish darting between swaying tentacles
- Giant sea fan wall with purple and pink gorgonians
- Sandy channel between coral heads with sea turtles gliding past
- Shallow lagoon floor with starfish, sea urchins, and dappled light
- Coral wall drop-off where the reef shelf ends and blue void begins
- Kelp-draped reef edge with octopus den and moray eel crevices
- Sunlit coral plateau with manta ray shadow passing overhead
- Seagrass meadow with seahorses and pipefish among the blades

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: coral formation type + depth (shallow/mid/deep) + companion marine life.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
