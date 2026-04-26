#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_cottage_details.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} PIXEL COTTAGE LIVED-IN DETAIL descriptions for PixelBot's pixel-cottage path. Each entry is a specific charming village detail that makes the scene feel inhabited and warm. Retro RPG energy — the kind of details you'd see zooming into a SNES/GBA town. The SETTING will be picked separately.

Each entry: 8-15 words. One specific village life detail.

━━━ CATEGORIES TO COVER ━━━
- Laundry and daily life (clothes on line, boots by door, woodpile stacked)
- Signage and commerce (hand-painted shop sign, crate of apples, bread in window)
- Garden details (herb pots, sunflowers against fence, watering can, beehive)
- Animals (chickens pecking, cat on windowsill, dog by hearth, ducks on pond)
- Atmosphere (chimney smoke curling, warm window glow, steam from bathhouse)
- Weather interaction (puddles reflecting lanterns, snow on rooftops, leaves swirling)
- Village infrastructure (stone well with bucket, wooden cart, hanging lanterns, mailbox)
- Whimsy (tiny fairy door at tree base, wind chimes, weather vane spinning)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: detail category + visual scale (tiny accent vs prominent feature).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
