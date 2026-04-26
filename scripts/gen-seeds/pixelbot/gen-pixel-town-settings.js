#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_town_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BUSTLING TOWN SETTING descriptions for PixelBot's pixel-town-life path. Busy pixel-art towns and cities — marketplaces, ports, taverns, train stations, bazaars. More urban and lively than cottage-core. RPG hub-town energy where adventurers gather and commerce happens.

Each entry: 10-20 words. A specific busy town location.

━━━ CATEGORIES TO COVER ━━━
- Markets and bazaars (open-air stalls, spice market, night market, fish market)
- Ports and docks (harbor with tall ships, loading cranes, seaside warehouse)
- Transit hubs (pixel train station, airship terminal, caravan rest stop)
- Entertainment (tavern interior, arena, theater, festival square with banners)
- Industrial (forge district, shipyard, mining town, lumber mill)
- Urban streets (rooftop view of dense town, narrow alley, canal district)
- Grand architecture (clock tower plaza, cathedral steps, palace gate, library)
- Underground (sewer junction, smuggler den, underground market, catacombs)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location function + architectural density (sparse/dense).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
