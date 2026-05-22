#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} LIGHTING descriptors for YumBot checkered-tabletop.

Each entry: 10-18 words.

━━━ DISTRIBUTION ━━━

- 30% SOFT-PASTEL DAYLIGHT (soft pastel-daylight from a window / dreamy diffused-pastel sunlight)
- 25% GOLDEN-HOUR (warm peach-pastel golden-hour light across the tabletop / honey-gold soft tabletop-light)
- 15% MORNING-PASTEL (early-morning pastel-light through gauzy curtain / dawn-pastel soft glow)
- 15% AFTERNOON-PASTEL (lazy 3pm pastel afternoon-warmth / soft afternoon pastel-light)
- 10% MAGIC-HOUR-PINK (impossibly pastel-pink magic-hour / saturated-pastel dream-light)
- 5% OVERCAST-COZY (soft pastel-grey overcast / dreamy soft-grey diffused tabletop light)

━━━ HARD MANDATES ━━━

- ALWAYS soft / warm / pastel
- Indoor-tabletop register OK

━━━ HARD BANS ━━━

- NO dark / moody / scary
- NO direct harsh sunlight

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
