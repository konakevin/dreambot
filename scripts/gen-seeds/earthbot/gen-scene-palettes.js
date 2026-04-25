#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE descriptions for EarthBot — specific color schemes that define the chromatic identity of a landscape scene. These are injected as color direction.

Each entry: 10-15 words. One specific color palette using named colors. No scene description, just colors.

━━━ CATEGORIES (mix across all) ━━━
- Warm earth tones (burnt sienna, raw umber, ochre gold, terracotta, warm sandstone)
- Cool ocean palettes (deep ocean blue, coral highlights, seafoam, turquoise, pearl white)
- Forest palettes (emerald, sage, moss green, bark brown, dappled gold, fern)
- Desert palettes (dusty rose, bleached bone, terracotta, shadow plum, heat-haze amber)
- Alpine palettes (glacier blue, granite grey, meadow green, snow white, crisp cyan)
- Autumn fire palettes (crimson, burnt orange, amber, deep burgundy, tawny gold)
- Twilight palettes (indigo, violet, rose gold, deep teal, star-white)
- Storm palettes (gunmetal, charcoal, pewter, cold steel, lightning white, distant amber)
- Tropical palettes (lime, hibiscus pink, mango orange, jungle shadow, turquoise)
- Volcanic palettes (obsidian black, lava orange, ash grey, sulfur yellow, ember red)
- Winter palettes (arctic blue, silver, ivory, pale violet, frost white)
- Golden hour palettes (honey amber, warm copper, long-shadow purple, gilded cream)

━━━ RULES ━━━
- COLORS ONLY — 3-5 specific named colors per entry, described as a palette
- Use evocative color names (not "dark blue" but "midnight indigo")
- Mix warm, cool, monochromatic, and complementary schemes across entries
- No scene descriptions — just the color palette itself
- No two entries should list the same color combination
- 10-15 words each — concise, specific, chromatic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
