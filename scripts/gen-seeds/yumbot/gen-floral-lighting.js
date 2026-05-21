#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_lighting.json',
  total: 30,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} LIGHTING descriptors for YumBot floral-garden-cup. Soft, warm, pastel, magical.

Each entry: 10-18 words.

━━━ DISTRIBUTION ━━━

- 30% SOFT GOLDEN-HOUR PASTEL (warm peach-amber soft-pastel light / honey-pastel golden hour glow / soft-warm pastel-amber)
- 25% MORNING-PASTEL (pearl-pink dawn-light / fresh-morning pastel-haze / soft-rose dawn-glow)
- 15% LAVENDER-TWILIGHT (lavender-twilight magic-hour with warm-pastel-rim-light / blush-lavender dusk-light)
- 10% PEARL-DIFFUSED (pearl-iridescent diffused-light / soft-pearlescent ambient / dreamy-diffused pastel-light)
- 10% MAGIC-HOUR-RAINBOW (impossibly-saturated-pastel magic-hour / fairy-tale ambient pastel-rainbow light)
- 5% SOFT-OVERCAST PASTEL (soft pastel-grey-overcast with warm-pastel-glow / dreamy diffused-cloud light)
- 5% MOONLIT-PASTEL (cool-pastel-silver moonlight with warm-pastel-rim-glow / soft-pearl-blue moonbeam)

━━━ HARD MANDATES ━━━

- ALWAYS soft / warm / pastel
- Magical-light register
- NEVER harsh / dramatic / dark

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
