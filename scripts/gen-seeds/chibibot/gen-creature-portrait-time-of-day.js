#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY descriptions for ChibiBot creature-portrait — the lighting register for a hyper-cute portrait. Soft, warm, magical lighting that flatters the creature.

Each entry: 10-18 words. ONE specific time-of-day / lighting register.

━━━ DISTRIBUTION ━━━

- 30% GOLDEN-HOUR (warm peach-amber golden-hour wrapping the creature / honey-gold late-afternoon glow / sun-kissed warm-amber light)
- 20% MORNING-PASTEL (soft pearl-pink morning light / dawn-glow with warm catchlight / fresh-morning soft pastel light)
- 15% BLUE-HOUR / DUSK (lavender-blue dusk with warm rim-light on creature / pre-twilight magical glow)
- 10% LANTERN-LIT / FIREFLY (warm-amber lantern-glow with firefly sparkle / paper-lantern warm pool of light)
- 10% MAGIC-HOUR-PINK (impossibly pink-magenta magic-hour / saturated dream-twilight)
- 5% MOONLIT (cool moonlit silver rim-light with warm catchlight in eyes)
- 5% AURORA-SHIMMER (aurora-glow rim-light with warm cottage-window-glow accent)
- 5% RAINBOW-AFTER-RAIN (rainbow-prism light / pastel-prism magic / iridescent-shimmer light)

━━━ HARD MANDATES ━━━

- Soft warm or magical light register
- Flatters the creature with rim-light or backlight
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO bright direct noon (too harsh)
- NO grim / bleak / cold-only time
- NO setting / creature / pose verbs

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
