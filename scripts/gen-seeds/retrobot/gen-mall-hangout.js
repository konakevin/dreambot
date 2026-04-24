#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/mall_hangout.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} MALL HANGOUT scene descriptions for RetroBot — the American shopping mall as social hub, 1980-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific mall scene or detail.

━━━ CATEGORIES ━━━
- Food court tables (orange trays, Sbarro slices, Orange Julius cups, soft pretzel)
- Arcade entrances (neon glow, carpet patterns, token machines, cabinet silhouettes)
- Record/music stores (Sam Goody, Musicland, cassette displays, listening stations)
- Fountain areas (penny-covered bottom, potted plants, benches, skylights)
- Escalators + glass elevators
- Department store entrances (Sears, JCPenney, perfume counters, mannequins)
- Photo booths (curtain strips, photo strips drying)
- Spencer's Gifts / Hot Topic vibes (lava lamps, black lights, novelty items)
- Cinnabon / Mrs. Fields / cookie counter
- Neon signs + chrome railings + terrazzo floors
- KB Toys / Toys R Us windows (action figure displays, stuffed animal pyramids)
- Clothing stores (The Gap, Limited Too, skate shop windows)
- Water fountains between stores
- Payphones near the restrooms
- Parking lot at golden hour (wood-paneled wagons, Trans Ams)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1980-1995 era — no modern stores, no smartphones, no LED signs
- The mall is alive even without people — implied by recently-used objects
- Gender-neutral — malls were everyone's hangout

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
