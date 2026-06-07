#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot fruits-and-veggies renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for organic outdoor scenes (garden / tree / vine / basket / forest / market).

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 5 WARM GARDEN SUNSHINE (overhead warm sun, gentle leaf-shadow play, garden-coded)
- 4 SOFT DAPPLED TREE LIGHT (filtered through canopy, dappled patches, tree-coded)
- 4 GOLDEN-HOUR HARVEST GLOW (long warm shadows, amber rim, basket / market / harvest)
- 4 SOFT SUN-DAPPLED FOREST (filtered shafts through canopy, magical forest-coded)
- 4 BRIGHT MARKET-STALL LIGHT (warm awning shadow + sunny ambient)
- 4 INTIMATE GARDEN MORNING (soft pre-warm dew light)

━━━ EXAMPLES ━━━

"Warm overhead garden sunshine with gentle leaf-shadow play across the subject"
"Soft dappled tree light filtered through the canopy in warm patches"
"Golden-hour warm wash across the harvest basket with long amber shadows"
"Soft sun-dappled forest light in filtered shafts through the canopy overhead"
"Bright warm market-stall ambient with soft awning shadow protecting the subject"
"Intimate garden morning light with soft warm tone and gentle dew shimmer"

━━━ HARD BANS ━━━

- NO photographer name-drops, camera specs, lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
