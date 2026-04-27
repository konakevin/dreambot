#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/scene_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE descriptions for FaeBot renders. Each entry is a specific forest-themed color palette with 3-5 named colors and their mood.

Each entry: 10-20 words. A named palette with specific colors.

━━━ CATEGORIES TO COVER ━━━
- Deep forest greens (emerald, moss, sage, hunter green, fern)
- Autumn warm (amber, rust, burnt sienna, gold, burgundy)
- Moonlit cool (silver, slate blue, pale lavender, bone white)
- Spring pastel (soft pink, mint, cream, butter yellow, lilac)
- Bioluminescent (electric blue-green, neon cyan on deep black)
- Earth tones (umber, ochre, terracotta, bark brown, sandstone)
- Twilight purple (deep violet, plum, mauve, dusty rose, indigo)
- Winter frost (ice blue, crystal white, pale mint, silver gray)
- Golden hour (honey, warm copper, amber, soft rose, peach)
- Dark fairy tale (charcoal, deep forest, blood red, tarnished gold)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: dominant hue + temperature (warm/cool) + mood.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
