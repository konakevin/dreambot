#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_town_activity.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TOWN ACTIVITY descriptions for PixelBot's pixel-town-life path. Each entry is a specific bustling activity or crowd moment happening in a town. The LOCATION will be picked separately.

Each entry: 8-15 words. One specific town-life activity or crowd scene.

━━━ CATEGORIES TO COVER ━━━
- Commerce (merchants hawking wares, haggling over gems, crates being unloaded)
- Food and drink (street food sizzling, tavern crowd cheering, baker pulling bread)
- Travel (caravan arriving through gates, ship being loaded, train departing in steam)
- Craft (blacksmith sparks flying, weaver at loom, potter spinning wheel)
- Social (festival dancers, musicians on corner, crowd around street performer)
- Labor (dock workers hauling rope, miners emerging, lumberjacks stacking)
- Conflict (town guard patrol, wanted poster being nailed up, suspicious cloaked figure)
- Weather events (crowd sheltering under awnings in rain, snow market, foggy dawn opening)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: activity type + energy level (calm/busy/chaotic).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
