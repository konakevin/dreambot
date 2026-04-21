#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for CuddleBot — warm soft storybook lighting treatments. Never harsh / dark / dramatic. Always warm + gentle + wholesome.

Each entry: 10-20 words. One specific warm-soft lighting treatment.

━━━ CATEGORIES ━━━
- Warm amber ambient (cozy indoor warm-lamp glow everywhere)
- Storybook-soft diffuse (even soft light as from picture book)
- Golden-hour-through-window (warm beams through nursery window)
- Candle-lit (tiny flickering warmth, cozy intimate)
- Firefly-glow (backlit with tiny magical lights)
- Sunbeam-through-canopy (dappled warm rays, soft leaves)
- Moon-soft silver (gentle pale moonlight, never harsh)
- Pink-sunrise rose-light (soft dawn pastels)
- Lavender-sunset violet-and-peach (soft warm dusk)
- Paper-lantern warm (cozy string-light magic)
- Nightlight-glow (soft warm single-source, bedroom-cozy)
- Dreamy haze-backlight (warm golden rim glow from behind)
- Storybook-dusk blue-hour (soft pastel deep-blue)
- Mushroom-lantern glow (magical tiny lanterns)
- Candy-store-window warm (saturated pastel from inside)
- Fire-side warm (cozy orange glow)
- Starlight twinkle (soft silver pinpoints)
- Teatime-warmth (soft afternoon gold)
- Snow-ambient cool-soft (gentle pale blue)
- Warm-rainy-window (soft blurred backlight through rain-glass)
- Cozy-bathtub glow (warm steam in warm light)

━━━ RULES ━━━
- ALWAYS warm / soft / storybook
- NEVER harsh / dark / stark-contrast
- Every treatment must support cozy / wholesome / cute

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
