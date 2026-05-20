#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} ENVIRONMENTAL PHENOMENA for ChibiBot sunny-village — atmospheric/weather/magical layers that fire on 60% of renders, adding a wow-moment.

Each entry: 12-25 words. ONE specific environmental phenomenon. Stack on base lighting.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% GOLDEN-LIGHT (golden-light-shafts pouring across the village / warm-light-haze / saturated Mediterranean glow)
- 15% PETAL-DRIFT (bougainvillea-petals drifting / olive-leaves spiraling / palm-fronds gently swaying)
- 15% HEAT-SHIMMER (shimmering hot-noon-air / heat-haze visible over distant roofs / mirage-distortion in the deep distance)
- 10% SEA-MIST (light sea-mist rolling in / soft Mediterranean haze / saltwater-haze in coastal-air)
- 10% RAINBOW (perfect rainbow over cottages / sundog-rainbow / ice-halo)
- 10% CICADAS-SHIMMER (insect-shimmer visible / butterfly cloud / dragonfly drift)
- 10% MAGICAL-LIGHT (golden-magic-hour-impossibly-saturated / light-pillar over a courtyard / a single sun-pillar)
- 5% RAIN-AFTER-HOT (refreshing rain on hot terracotta / steam-rising / quick-coastal-shower)

━━━ HARD MANDATES ━━━

- Always warm-cozy bias — phenomenon adds magic without making the scene grim
- Pixar painterly storybook
- Visible in the rendered image (specific, not abstract)

━━━ HARD BANS ━━━

- NO scary / threatening / apocalyptic weather
- NO setting / creature / activity language
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
