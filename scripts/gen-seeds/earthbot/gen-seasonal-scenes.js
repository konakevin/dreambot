#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/seasonal_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DRAMATIC SEASONAL MOMENT descriptions for EarthBot — landscapes at their most stunning seasonal peak, capturing the exact moment a season transforms the earth.

Each entry: 15-25 words. One specific seasonal landscape moment. No people.

━━━ CATEGORIES (mix across all) ━━━
- Autumn forests ablaze (peak foliage maples, aspen gold, larch yellow, mixed hardwood fire colors)
- First snow on mountain valleys (dusting of white on still-green meadows, snow line descending)
- Cherry blossom storms (petals blowing across rivers, sakura tunnels, blossoms on still water)
- Spring wildflower explosions (superbloom carpets, alpine meadow eruptions, bluebonnet seas)
- Monsoon greens (lush post-monsoon hillsides, emerald rice terraces, dripping tropical forests)
- Winter twilight on frozen lakes (purple-blue light on ice, snow-covered shorelines, frozen silence)
- Summer thunderstorm approaching (dark anvil clouds over golden wheat fields, green-tinted light)
- Ice breakup on rivers (spring thaw cracking river ice, ice floes on meltwater, dramatic calving)
- Autumn mist mornings (fog threading through fall-color valleys, spider webs with dew in gold leaves)
- Desert bloom (rare rain bringing flowers to arid land, ocotillo and cactus flowers, desert lupine)
- Winter hoarfrost (every branch and blade coated in white ice crystals, frozen fog aftermath)
- Late summer golden fields (ripe wheat, dried grass prairies, golden hour on harvest-ready land)

━━━ RULES ━━━
- Capture the PEAK MOMENT of seasonal change — not generic "winter scene"
- Specific geography + specific seasonal phenomenon in each entry
- Mix all four seasons and transitional moments across entries
- Real seasonal phenomena from diverse global regions
- No two entries should describe the same season in the same geography
- 15-25 words each — vivid, transient, emotionally charged language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
