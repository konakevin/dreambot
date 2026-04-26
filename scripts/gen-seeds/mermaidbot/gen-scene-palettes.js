#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/scene_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE descriptions for MermaidBot renders. Each entry is a specific color palette that drives the mood of one render.

Each entry: 10-20 words. A named palette with 3-5 specific colors and their emotional feel.

━━━ CATEGORIES TO COVER ━━━
- Deep ocean blues (navy, cerulean, midnight, cobalt)
- Tropical warm (coral, turquoise, gold, sunset orange)
- Bioluminescent (electric blue, neon green, violet glow on black)
- Gothic dark (charcoal, blood red, bone white, tarnished silver)
- Arctic (ice blue, pearl white, aurora green, glacier cyan)
- Golden hour (amber, honey, warm copper, soft rose)
- Moonlit (silver, slate blue, pale lavender, ghostly white)
- Jewel tones (emerald, sapphire, ruby, amethyst, gold)
- Storm (gunmetal gray, lightning white, deep green, foam white)
- Ethereal pastel (soft pink, sea foam, pearl, lavender mist)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: dominant hue + temperature (warm/cool/neutral).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
