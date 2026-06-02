#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY descriptions for ChibiBot arctic-village — the lighting time across an arctic-village scene. Always WARM-cozy contrast against cool snow despite the cold biome.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 25% AURORA NIGHT (deep-blue arctic night with shimmering green-and-violet aurora overhead, warm-amber window-glow contrasting / dark-teal sky lit by aurora ribbons, cottage lights twinkling / aurora-arched night with cool-purple snow-shadows and warm interior lights)
- 20% GOLDEN-HOUR SNOW (warm peach-amber late-afternoon sun across the snow / honey-gold low-angle light raking snowdrifts / late-afternoon golden-hour on snow-laden pine-trees)
- 15% BLUE-HOUR DUSK (lavender-blue dusk with first cottage windows lit warm-amber / pre-twilight blue-hour with cool-snow shadows and warm interior lights / soft-violet dusk haze)
- 15% LANTERN-LIT NIGHT (deep-blue night with every cottage lit warm-amber and lantern-poles glowing / fairy-light-strand-lit village under starry sky / candle-window night with snow-lit-by-warm-light)
- 10% MORNING SNOW-LIGHT (early-morning pearl-pink light filtering across snow / first-light dawn with soft amber on snow-laden roofs / sunrise-warm-glow on a snowy village)
- 10% OVERCAST SNOWFALL (cozy grey-overcast with fresh snowfall, soft diffused light, warm-amber windows glowing through the snow / soft-grey snowfall with cottage-windows providing the only warm color)
- 5% NOON SNOW (warm midday sun on snow with long blue-shadows / peak-warm-noon with deep-cool snow-shadows and warm sun-glints on roofs)

━━━ HARD MANDATES ━━━

- ALWAYS warm-cozy contrast against the cool snow — warm-amber window-glow / lantern-light / aurora-shimmer
- Pixar painterly storybook register

━━━ HARD BANS ━━━

- NO grim / bleak / cold-only time
- NO harsh / dramatic / scary lighting
- NO setting / creature / activity verbs
- NO summer light

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
