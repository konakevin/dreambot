#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for LEGO toy photography. Each describes how light hits plastic bricks, creates shadows on studs, and sets the mood for a brick diorama.

Each entry: 15-25 words. One specific lighting setup.

━━━ LIGHTING TYPES (mix broadly) ━━━
- Warm studio softbox, gentle shadows between studs, even illumination
- Single dramatic spotlight from above, harsh shadows, noir contrast
- Golden hour warmth catching glossy plastic surfaces, long shadows
- Cool blue moonlight on brick surfaces, transparent pieces glowing
- Backlit rim light outlining brick edges, silhouette drama
- Colored gel lighting: red/blue/green tinting specific areas
- Macro ring light, even detail illumination, no shadows
- Window light from one side, soft gradient across diorama
- Multiple colored spotlights creating dramatic stage lighting
- Candlelight warmth from transparent orange pieces, intimate glow

━━━ RULES ━━━
- Describe how light interacts with LEGO plastic specifically
- Mention stud shadows, plastic reflections, transparent piece glow
- Vary dramatically — warm/cool, harsh/soft, single/multiple sources
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
