#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY descriptions for ChibiBot miniature-feast — the lighting time that's always soft, pastel, kawaii. Pop-Mart aesthetic.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 30% AFTERNOON TEA-LIGHT (warm soft-pastel afternoon glow through gauzy curtains / 3pm pastel-amber sun pouring across the kawaii table / lazy-pastel afternoon light bouncing off pearlescent surfaces)
- 20% LAVENDER TWILIGHT (lavender-twilight soft hour with first warm-lamp-glow / blush-lavender dusk through a pastel window / pre-twilight magic hour with pastel pink-and-lavender sky)
- 15% MORNING PASTEL (early-morning pastel-pink light / sunrise blush-glow / morning-pearl light through gauzy curtain / pastel breakfast-light)
- 15% SOFT-OVERCAST WINDOW (soft pastel-grey overcast filtered through window with warm-pastel-lamp-glow / dreamy diffused soft-overcast pastel afternoon)
- 10% GOLDEN-HOUR PASTEL (warm peach-pastel golden-hour / honey-blush late-afternoon / soft-amber pastel golden-glow)
- 5% RAINBOW-AFTER-RAIN (rainbow-arc visible outside / golden-pastel light after pastel-rain / soft post-rain rainbow glow)
- 5% MAGIC-HOUR-PASTEL (impossible pastel-magic-hour / dream-pastel ambient light / fairy-tale-pastel illumination)

━━━ HARD BANS ━━━

- NO bright direct noon
- NO harsh / dramatic light
- NO dark / moody time
- NO blue-hour (too cold) — replace with lavender-twilight (warmer)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
