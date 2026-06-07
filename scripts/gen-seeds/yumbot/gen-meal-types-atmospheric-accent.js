#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_atmospheric_accent.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC ACCENT moments for YumBot meal-types renders. Each entry is a tiny atmospheric flourish that makes the scene feel ALIVE — steam wisps, sparkle particles, drifting flour dust, butter melt-drip, syrup pour mid-air, condensation beads, neon haze, candle flicker, etc.

Each entry: 10-18 words. ONE specific atmospheric flourish, present but understated.

━━━ DISTRIBUTION ━━━

- 5 STEAM / VAPOR (rising coffee steam wisp / kettle steam / hot pancake heat shimmer / cocoa vapor / tea curl)
- 4 SPARKLE / GLITTER (powdered-sugar mist / sugar-glitter air / fairy-sparkle / soft particles / pixie dust)
- 4 LIQUID-IN-MOTION (syrup drip / honey strand / cream pour / milk splash / sauce drizzle)
- 4 NATURAL DUST / MOTE (drifting flour cloud / morning dust mote / pollen drift / cocoa-dust puff / cinnamon shake)
- 4 CONDENSATION / DEWY (cold-glass condensation beads / frosty mug fog / chilled-drink sweat / icy bottle haze / dew on fruit)
- 4 NIGHT / NEON (neon haze / candle flicker / soft lamp halo / firefly trail / moonlight beam)

━━━ EXAMPLES ━━━

"A delicate curl of steam rising from a hot kawaii mug, slow rolling vapor"
"Soft sugar-glitter mist drifting in the air, catching warm light"
"A long ribbon of golden honey mid-pour, caught in motion"
"A drifting puff of flour dust hanging in the kitchen air"
"Cold condensation beads on the glass surface, slowly forming a slick"
"A soft neon haze settling on the food-truck counter, magenta and teal mingling"

━━━ HARD MANDATES ━━━

- Atmospheric ACCENT is small / understated — adds life, doesn't dominate
- Specific flourish, named clearly

━━━ HARD BANS ━━━

- NO subject / scene language
- NO camera / framing language
- NO color palette names
- NO time-of-day labels

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
