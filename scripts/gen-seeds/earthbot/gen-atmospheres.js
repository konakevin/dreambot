#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC CONDITION descriptions for EarthBot — specific atmospheric states that define the air itself, the medium through which a landscape is experienced.

Each entry: 15-25 words. One specific atmospheric condition in a specific setting. No people.

━━━ CATEGORIES (mix across all) ━━━
- Thick morning fog (valley fog filling basins, tule fog over farmland, coastal fog pouring through gaps)
- Golden pollen clouds (pine pollen drifting in shafts of light, cottonwood fluff filling air)
- Heat shimmer (mirage ripples over desert road, hot-air distortion above sun-baked rock)
- Rain-washed air clarity (crystal-clear post-rain atmosphere, every distant peak razor-sharp)
- Volcanic haze (vog filtering sunlight orange, ash-tinged air, sulfur-yellow sky near vents)
- Drifting mist tendrils (fog fingers threading through forest, mist peeling off waterfalls)
- Humid tropical air (visible moisture in jungle canopy, condensation dripping, green-tinted humidity)
- Dust-laden air (Saharan dust sunset, wildfire smoke haze, construction-site ochre air)
- Snow-filled air (heavy snowfall reducing visibility, snow squall whiteout, gentle flurry drifts)
- Salt spray atmosphere (ocean mist hanging over coast, salt crystallizing on rocks, spray rainbows)
- Ice crystal air (diamond dust sparkling in polar sun, frozen fog particles, ice needles falling)
- Steam and geothermal (hot spring steam columns, geyser mist, volcanic vent steam mixing with cold air)

━━━ RULES ━━━
- The ATMOSPHERE itself is the subject — what the air looks, feels, and behaves like
- Each entry specifies both the atmospheric condition AND the landscape it inhabits
- Real atmospheric phenomena only — no fantasy particles or magical mist
- Mix seasons, climates, and times of day across entries
- No two entries should describe the same atmospheric condition in the same setting
- 15-25 words each — tactile, immersive, sensory language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
