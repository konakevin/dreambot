#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_background.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} BACKGROUND MOODS for YumBot floral-garden-cup. Dreamy soft-bokeh that supports the floral-fantasy vessel — NOT a recognizable setting.

Each entry: 12-22 words.

━━━ DISTRIBUTION ━━━

- 25% PASTEL-PINK BOKEH-HAZE (dreamy pastel-pink bokeh-haze with floating sparkle / pastel-pink soft-focus garden-haze / blush-pink dreamy bokeh)
- 20% LAVENDER-PURPLE HAZE (lavender-violet soft-bokeh background with mist / dreamy-purple-mist haze / pastel-lilac soft-focus melt)
- 15% PASTEL-CREAM (pearl-cream dreamy bokeh / soft-cream mist-haze / antique-cream bokeh-blur)
- 15% PASTEL-RAINBOW (pastel-rainbow bokeh-melt with cherry-blossom-blur / soft-rainbow-pastel hazy background)
- 10% PASTEL-MINT (pastel-mint dreamy haze / soft-sage bokeh-blur / pearl-mint mist)
- 10% PASTEL-BLUE (pastel-sky-blue dreamy haze / soft-blue bokeh-blur / pearl-blue mist)
- 5% PEACH-WARM (peach-warm bokeh-glow / dusty-coral mist / pastel-peach soft-focus)

━━━ HARD MANDATES ━━━

- ALWAYS soft-focus / bokeh / dreamy
- Pastel palette
- May suggest a hint of garden / floral / petals in the haze (but NOT a recognizable scene)

━━━ HARD BANS ━━━

- NO recognizable setting (no village / no specific indoor / no specific outdoor)
- NO sharp-focus / clear-details in background
- NO dark / saturated

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
