#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/changeling_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CHANGELING SETTING descriptions for FaeBot's changeling path. Liminal boundary spaces — forest edges, cottage doorsteps, garden gates, abandoned buildings at the border between civilized and wild. The changeling exists at THRESHOLDS between human and fae worlds.

Each entry: 10-20 words. A specific liminal/boundary environment.

━━━ CATEGORIES TO COVER ━━━
- Cottage doorstep where the garden meets the forest, wildflowers growing through the path stones
- Abandoned farmhouse kitchen, dust on every surface, a single wildflower growing through the floorboards
- Garden gate left ajar, the cultivated side neat, the wild side pressing in with brambles
- Village edge at dusk, the last house before the forest, a single candle in the window
- Ruined stone wall where a garden once was, now half-reclaimed by the forest
- Bridge between a village and the woods, the halfway point between human and fae territory
- Attic of an old cottage, dormer window showing the forest, abandoned toys on the floor
- Forest path that transitions from flagstones to dirt to moss, the border visible underfoot
- Wishing well at a crossroads, the point where four paths meet at the forest edge
- Overgrown churchyard at the edge of the village, headstones leaning, ivy on everything
- Market square at dawn before anyone is awake, the stalls empty, morning mist from the forest
- Abandoned nursery room in a cottage, crib near a window that faces the dark forest

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: structure type (cottage/farm/village/ruin/path) + position on the wild-to-civilized spectrum.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
