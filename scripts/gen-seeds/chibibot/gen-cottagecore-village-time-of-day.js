#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} TIME-OF-DAY descriptions for ChibiBot cottagecore-village — biome-fitting lighting registers. Pixar painterly storybook.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 30% GOLDEN-HOUR COTTAGECORE (warm peach-amber late-afternoon golden-hour across thatched roofs / honey-gold sun across cottage gardens / late-afternoon warm-glow)
- 20% MORNING-DEWY (early-morning pearl-pink light with dew on every leaf / dawn light through wisteria / fresh-morning soft glow)
- 15% BLUE-HOUR DUSK (lavender-blue dusk with first cottage-windows lit warm-amber / pre-twilight cottagecore mood)
- 15% LANTERN-LIT EVENING (twilight with every cottage-window glowing warm-amber and string-lights between buildings)
- 10% OVERCAST-SOFT (cozy soft-grey overcast diffused over a cottagecore village / dreamy diffused English-countryside-light)
- 5% MIDDAY-WARM (warm midday sun with deep cottage-shadows / lazy-summer noon)
- 5% RAINBOW-AFTER-RAIN (rainbow visible over a cottage-roof / fresh-rain post-shower with sparkling-droplets)

━━━ HARD MANDATES ━━━

- Match the cottagecore-biome register
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO grim / bleak time
- NO harsh / dramatic light
- NO setting / creature / activity verbs
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
