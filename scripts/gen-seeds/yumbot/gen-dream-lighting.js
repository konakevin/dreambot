#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_lighting.json',
  total: 30,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} LIGHTING descriptors for YumBot rainbow-dreamscape. Sunny pastel outdoor light.

Each entry: 10-18 words.

━━━ DISTRIBUTION ━━━

- 40% SUNNY PASTEL DAYLIGHT (warm pastel-sunny daylight pouring across the meadow / bright sunny pastel-light bathing the scene)
- 25% GOLDEN-HOUR (warm-amber golden-hour light across the meadow / honey-gold low-sun raking the landscape)
- 15% MORNING-DEWY (early-morning pastel-light with dew-sparkle / fresh-morning sunny-pastel glow)
- 10% LATE-AFTERNOON (lazy late-afternoon pastel sun / soft 4pm warm-pastel light)
- 5% TWILIGHT-MAGIC (magic-hour twilight-pastel with rainbow-glow / blue-hour with rainbow-shimmer)
- 5% RAINBOW-PRISM (rainbow-prism-light scattering across everything / multi-rainbow-shimmer-light)

━━━ HARD MANDATES ━━━

- Sunny / outdoor / warm
- Pastel register

━━━ HARD BANS ━━━

- NO dark / moody
- NO indoor / artificial

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
