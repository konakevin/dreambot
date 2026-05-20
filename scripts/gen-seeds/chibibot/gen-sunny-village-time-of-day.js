#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} TIME-OF-DAY descriptions for ChibiBot sunny-village — biome-fitting lighting registers. Pixar painterly storybook.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 30% GOLDEN-HOUR MEDITERRANEAN (warm peach-amber low-angle golden hour across white-washed walls / honey-gold sun raking terracotta roofs / late-afternoon warm-coastal glow)
- 20% HOT-NOON-SHADE (peak-warm noon with deep cool-blue shadows under awnings / blistering bright Mediterranean midday / sun-saturated sun-baked stone)
- 15% MORNING-COASTAL (early-morning warm-amber light over a Mediterranean village / dawn over the sea / sunrise-warm-glow across white cottages)
- 15% BLUE-HOUR DUSK-COAST (deep-violet-orange Mediterranean dusk with first lanterns lit / coastal-dusk magic-hour / sea-reflected dusk-pink)
- 10% AFTERNOON-WARM (lazy warm Mediterranean afternoon / 3pm sun-baked stone / dappled palm-shadow afternoon)
- 5% RAINBOW-AFTER-STORM (rainbow over white cottages after a brief shower / post-rain Mediterranean sparkle)
- 5% MAGIC-HOUR (impossibly warm Tuscan-magic-hour / saturated Mediterranean dream-light)

━━━ HARD MANDATES ━━━

- Match the sunny-biome register
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO grim / bleak time
- NO harsh / dramatic light
- NO setting / creature / activity verbs
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
