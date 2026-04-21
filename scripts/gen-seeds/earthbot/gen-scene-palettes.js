#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for EarthBot — the overall color mood of an earthly scene. Earth-rooted color schemes.

Each entry: 10-20 words. One specific earth-rooted color palette.

━━━ CATEGORIES ━━━
- Golden-hour Earth palettes (amber + honey + copper + warm pine)
- Blue-hour Earth palettes (cobalt + deep slate + silver + cool teal)
- Stormy palettes (charcoal + pewter + cold steel + distant amber break)
- Autumn palettes (rust + burnt sienna + pumpkin + deep forest)
- Winter palettes (arctic blue + silver + white + pale violet shadows)
- Tropical palettes (emerald + turquoise + sun-gold + jungle shadow-green)
- Desert palettes (terracotta + dusty rose + bleached-bone + deep shadow-plum)
- Alpine palettes (glacier-blue + slate + pale ochre grass + crisp white)
- Volcanic palettes (obsidian + lava-orange + ash-grey + wisp of white steam)
- Misty-pastel palettes (pale opal + soft grey-blue + cream + rose-mist)
- Heather / moorland palettes (purple-heather + gold-gorse + green-moss + slate)
- Redwood / old-growth palettes (deep forest-green + moss + wet-bark brown + filtered gold)
- Coastal dawn palettes (salmon + pale teal + seafoam + soft grey-blue)
- Savanna palettes (golden-grass + dust-tan + umbrella-tree green + dusk-amber)

━━━ RULES ━━━
- Named palette families only — Earth-plausible color moods
- Include 3-5 specific color words per entry
- NO fantasy palette language (no "bioluminescent green", no "otherworldly violet")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
