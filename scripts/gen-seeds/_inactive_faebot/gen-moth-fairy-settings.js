#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/moth_fairy_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MOTH FAIRY SETTING descriptions for FaeBot's moth-fairy path. Nocturnal forest environments — moonlit clearings, lantern-lit paths, candlelit windows, bioluminescent groves. ALWAYS nighttime.

Each entry: 10-20 words. A specific nocturnal forest environment.

━━━ CATEGORIES TO COVER ━━━
- Moonlit clearing where silver light pools on the grass like water
- Old lantern hanging from a branch, warm glow attracting insects
- Cottage window spilling candlelight into the dark garden
- Forest edge at twilight, last purple light fading behind the trees
- Campfire embers in a forest clearing, orange sparks drifting upward
- Bioluminescent mushroom cluster glowing blue-green in total darkness
- Starlit meadow at midnight, the Milky Way visible above
- Full moon rising behind bare winter branches, casting sharp shadows
- Firefly swarm in a summer meadow, hundreds of floating lights
- Candle-lit shrine at a forest crossroads, offerings of flowers and honey
- Bridge over a dark stream, a single lantern on the railing
- Abandoned greenhouse at night, moonlight through broken glass panes

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: light source type (moon/lantern/candle/bio/fire) + forest density.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
