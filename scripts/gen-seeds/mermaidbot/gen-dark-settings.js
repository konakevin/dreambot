#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/dark_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DARK/GOTHIC SETTING descriptions for MermaidBot's mermaid-dark path. Haunted maritime environments — shipwrecks, storms, drowned architecture, ghost-ship graveyards.

Each entry: 10-20 words. A specific dark maritime environment.

━━━ CATEGORIES TO COVER ━━━
- Sunken cathedral with stained glass still intact, fish swimming through the nave
- Storm-wrecked galleon on its side, rigging tangled with kelp
- Drowned graveyard with tilted headstones and barnacle-covered crosses
- Ghost ship drifting in fog, lanterns swinging on empty decks
- Underwater bone yard — whale skeletons and ship timbers mixed together
- Flooded dungeon with chains and iron doors, water pouring through cracks
- Volcanic black-rock coastline in a lightning storm
- Sunken treasure vault with scattered gold coins and collapsed shelving
- Kelp forest so dense it blocks all light, creating underwater twilight
- Whirlpool edge where debris spirals downward into darkness

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: ruin type + water visibility + weather/lighting.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
