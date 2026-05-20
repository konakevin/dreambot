#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptions for ChibiBot outdoor-adventure — the lighting time across a wilderness adventure scene. Pixar painterly storybook register.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 25% GOLDEN-HOUR WILDERNESS (warm peach-amber late-afternoon golden hour through trees / honey-gold low-angle sun raking across mountain meadows / golden-hour reflecting off water / amber late-light on canyon walls)
- 15% MISTY MORNING (early-morning mist hanging low over the wilderness / dawn fog drifting through trees / pearl-grey morning light filtering through forest)
- 15% SUN-DAPPLED AFTERNOON (warm midday sun dappling through forest canopy / sunbeams piercing clouds onto a meadow / sun-shafts through tree-trunks)
- 10% BLUE-HOUR DUSK (lavender-blue dusk over a wilderness vista / pre-twilight magic hour over a mountain / soft-violet dusk on a lake)
- 10% TWILIGHT FIREFLIES (warm dusk with fireflies emerging / soft pink-purple sky with first stars / magical twilight haze)
- 5% LANTERN-LIT NIGHT (cave or glowworm-grotto lit by lanterns / nighttime adventure with a creature's glow-jar / firefly-lit night-meadow)
- 5% MAGIC-HOUR / RAINBOW (impossible saturated magic-hour light / rainbow over a vista / aurora glow on a snow-meadow)
- 5% FOGGY-DAWN / OVERCAST (cozy soft-grey overcast over a fern-glade / foggy mountain-vista / soft diffused light on a lake)
- 5% NOON-CLEAR (warm bright noon with crisp shadows / peak-warm-day on a mountain / midday in a desert oasis)
- 5% SUNSET / MAGIC (magenta-pink sunset behind silhouetted trees / fiery sunset over canyon walls / saturated sunset-magic-hour)

━━━ HARD MANDATES ━━━

- Warm or magical lighting register
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO grim / bleak / threatening time
- NO setting / creature / activity verbs
- NO harsh / dramatic / scary lighting

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
