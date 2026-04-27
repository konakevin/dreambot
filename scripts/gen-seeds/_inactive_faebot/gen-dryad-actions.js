#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/dryad_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRYAD ACTION descriptions for FaeBot's dryad path. Each entry is what an ancient tree spirit is DOING — merging with her tree, tending the forest, channeling deep-root power. Slow, powerful, ancient. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific tree-spirit action.

━━━ CATEGORIES TO COVER ━━━
- Emerging from the trunk of her tree, bark splitting open around her shoulders
- Pressing her palms flat against the earth, roots erupting outward from her touch
- Lifting a fallen branch and fusing it back to the tree with a touch
- Stretching upward after centuries of stillness, bark cracking along her arms
- Extending root-like fingers into the soil, connecting with the mycelium network
- Turning her face toward a shaft of sunlight, leaves unfurling from her hair
- Wrapping her arms around her tree trunk, merging back into the bark
- Catching a falling bird's nest mid-air and placing it gently on a branch
- Standing motionless as moss grows across her shoulders in real time
- Pulling water up through the ground with a gesture, a spring appearing at her feet
- Shedding autumn leaves from her body as she walks through the grove
- Growing new branches from her fingertips, reaching toward the canopy

━━━ BANNED ━━━
- Sitting / lying passively / sleeping
- "Posing", "modeling", looking at the camera

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + tree/earth element involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
