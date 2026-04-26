#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/royal_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} UNDERWATER PALACE/ROYAL SETTING descriptions for MermaidBot's mermaid-royal path. Grand underwater architecture — Atlantean palaces, coral cathedrals, pearl throne rooms, treasure vaults.

Each entry: 10-20 words. A specific regal underwater setting.

━━━ CATEGORIES TO COVER ━━━
- Massive coral throne room with bioluminescent ceiling and pearl-inlaid floor
- Underwater ballroom with crystal chandeliers and floating silk banners
- Pearl treasury vault with cascading jewels and golden artifacts
- Grand staircase of polished abalone descending into a palace atrium
- Royal garden of cultivated sea anemones and rare coral species
- Observatory dome of transparent crystal overlooking the ocean expanse
- Council chamber with carved stone seats arranged in a circle
- Armory of ancient ocean weapons displayed on coral racks
- Temple of an ocean goddess with towering coral columns
- Royal bedchamber with silk-draped alcove and luminescent ceiling

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: room function + architectural material + scale (intimate/grand).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
