#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/mermaid_features.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} UNIQUE MERMAID FEATURE descriptions for MermaidBot. Each entry is a complete physical description of ONE mermaid's distinctive features — tail, scales, hair, jewelry, markings. These are rolled once per render and injected into every path.

Each entry: 25-40 words. A specific mermaid's unique visual identity.

━━━ DIMENSIONS TO VARY ━━━
- Tail color + pattern (iridescent emerald, deep violet with gold flecks, midnight black with bioluminescent veins, coral pink gradient, pearl white, blood red, turquoise-to-silver ombre)
- Scale texture (smooth glass, rough barnacle-crusted, translucent, metallic, matte velvet, prismatic)
- Fin shape (flowing gossamer, sharp angular, tattered, ribbed like a lionfish, fan-shaped, spiked)
- Hair (silver waterfalls, black ink-clouds, red kelp-tangles, white frost-strands, green sea-grass, bioluminescent streaks)
- Jewelry/adornment (pearl strands, coral crowns, shell earrings, gold chains, bone piercings, sea-glass pendants, abalone cuffs, starfish clips)
- Markings (bioluminescent tattoo-lines, freckle-like barnacle spots, tiger-stripe scale bands, spiral shell patterns on shoulders)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: tail color + hair color + primary adornment. No two entries share all three.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
