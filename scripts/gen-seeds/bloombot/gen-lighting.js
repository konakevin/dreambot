#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/lighting.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for BloomBot renders. Every render has DRAMATIC lighting — never flat daylight. Each entry names a specific lighting treatment.

Each entry: 10-20 words. Specific direction + quality + color temperature.

━━━ CATEGORIES ━━━
- Golden hour backlight through translucent petals
- Rembrandt chiaroscuro — hard directional, deep shadows
- Dawn sidelight — cool pearlescent, long soft shadows
- Dusk warm sidelight with atmospheric haze
- Dappled canopy light — broken shafts through leaves
- Moonlit silver cool-light, frost-bloom atmosphere
- Stormy overcast with single sun shaft breaking through
- Candlelit warm interior amber glow
- Underwater god-rays piercing blue
- Bioluminescent glow from within the flowers
- Window shaft of sun into shadowed interior
- Rainlight diffused soft gray
- Starlight with drifting cosmic glow
- Firelight orange flicker with deep shadow
- Foggy morning diffuse pearl light
- High-key overexposed dreamy bright
- Spotlight dramatic single-source on hero flower
- Dappled sunset through arbor
- Overcast moody low-contrast jewel-toned
- Twilight magic-hour indigo-to-rose gradient
- Lantern-lit pools of warm amber
- Greenhouse sun filtered through condensation
- Forest clearing sun-shaft piercing shade
- Aurora-borealis glow
- Candlelight + moonlight dual-source

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
