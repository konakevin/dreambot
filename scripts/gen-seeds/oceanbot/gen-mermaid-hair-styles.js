#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_hair_styles.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID HAIR STYLE/TEXTURE descriptions for OceanBot's mermaid-legend path. JUST the style and texture — no color. ALL HAIR MUST BE LONG, FLOWY, AND BEAUTIFUL — shoulder length or longer. No bobs, no short hair, no cropped styles.

Each entry: 5-12 words. How the hair looks and behaves.

━━━ RANGE TO COVER (all long/flowing) ━━━
- Long and flowing, drifting in current
- Wild and tangled, knotted with salt, past her waist
- Thick braids woven with tiny shells, trailing down her back
- Sleek and wet, clinging to her back and shoulders
- Heavy with ocean weight, cascading past her hips
- Smooth and silky, fanning out in water like a veil
- Loose waves dripping saltwater, tumbling over her shoulders
- Intricately braided with coral fragments, waist-length
- Wild untamed mane, whipping in storm wind
- Rope-thick and coarse, thrashing behind her in the current
- Gentle curls drifting weightlessly around her face and chest

━━━ RULES ━━━
- STYLE/TEXTURE ONLY — no color words (no black, blonde, red, etc.)
- ALL hair MUST be shoulder length or longer — NO short hair, NO bobs, NO pixie cuts, NO cropped styles
- Long, flowy, and beautiful — these are mythical sea creatures
- Describe how it looks, moves, and feels in a maritime setting
- Vary between calm-water and rough-water behaviors
- No two entries the same silhouette

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
