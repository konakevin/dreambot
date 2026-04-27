#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/hedge_witch_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} HEDGE WITCH COTTAGE SETTING descriptions for FaeBot's hedge-witch path. Cozy forest cottages, herb gardens, kitchen interiors, forest clearings with smoke curling from chimneys. Cottage-core made mythic.

Each entry: 10-20 words. A specific cottage/garden/forest-edge environment.

━━━ CATEGORIES TO COVER ━━━
- Cottage kitchen with bundles of drying herbs hanging from every rafter, cauldron simmering
- Overgrown herb garden behind a stone cottage, paths lined with lavender and thyme
- Root cellar lined with labeled jars of preserved herbs, mushrooms, and tinctures
- Cottage doorstep at dawn, morning mist in the garden, a cat on the step
- Workshop table covered in mortar and pestle, dried flowers, candle stubs, open books
- Forest clearing with a moss-covered stone cottage, smoke from the chimney
- Windowsill crowded with potted plants, crystals, and small bottles catching the light
- Walled garden with espaliered fruit trees, beehives, and a stone well
- Pantry shelves crammed floor to ceiling with jars of honey, oils, and dried roots
- Cottage interior lit by firelight, shadows dancing on walls covered in dried herb bundles
- Outdoor work table under a pergola draped with wisteria, grinding herbs
- Forest path leading to a cottage barely visible through wild roses and brambles

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: interior/exterior + primary craft element (herbs/jars/cauldron/garden/fire).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
