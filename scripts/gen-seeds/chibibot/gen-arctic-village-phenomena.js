#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot arctic-village — atmospheric/weather/magical layers that fire on 60% of renders, adding a wow-moment to the scene.

Each entry: 12-25 words. ONE specific environmental phenomenon. Stack on top of base lighting.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% AURORA (vivid green-and-violet aurora arch overhead / shimmering aurora ribbons curling across the dark sky / aurora-cascade pouring down behind the village / pulse of pink-magenta aurora reflecting on the snow)
- 15% SNOWFALL (gentle fat snowflakes drifting straight down / soft windblown snowflakes catching window-light / fresh snowfall covering everything in pristine white / glitter-snowfall with each flake catching warm light)
- 15% MIST / FOG / STEAM (low-pearl mist hanging over the village / hot-spring-steam rolling through the streets / soft-snow-fog blanketing distance / pine-tree-fog wisping through the village)
- 10% STARS / MOON-MAGIC (impossibly bright Milky-Way overhead / full-moon with a frosted halo / moonlit-snow-glow making everything blue-silver / a shooting-star streaking)
- 10% ICE-FORMATION (sudden frost-feathers on every surface / a crystal-clear ice-arch above the village / icicle-curtain hanging from cliff-faces / frozen-stream-of-light glimmering)
- 10% RAINBOW-MAGIC (sundog-rainbows flanking the sun / ice-halo-rainbow / a perfect snow-rainbow arching / pastel-light-pillar columns rising from cottages)
- 10% MAGICAL-LIGHT (golden-light-shafts breaking through clouds / pink-warm-glow saturating the whole scene / impossible-soft-radiance suffusing the village / a single light-pillar over the village center)
- 5% STORM-COZY-CONTRAST (heavy snowfall outside contrasting with warm-amber-windows / a blizzard-blur in the deep background, village glowing safely / wind-driven snow-streaks with warm-glow holding firm)
- 5% ICE-PRISM (refraction-rainbows on icicles / prism-rainbows from a snowflake-window / kaleidoscope-aurora reflected in ice-pond)

━━━ HARD MANDATES ━━━

- The phenomenon adds magic WITHOUT making the scene grim — always warm-cozy bias
- Pixar painterly storybook register
- Visible in the rendered image (specific, not abstract)

━━━ HARD BANS ━━━

- NO scary / threatening / apocalyptic weather
- NO setting / creature / activity language
- NO summer phenomena

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
