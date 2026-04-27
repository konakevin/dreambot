#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/mushroom_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MUSHROOM SPIRIT SETTING descriptions for FaeBot's mushroom-spirit path. Deep fungal environments — bioluminescent mushroom forests, mycelium caves, spore-filled hollows, rotting log ecosystems.

Each entry: 10-20 words. A specific fungal environment.

━━━ CATEGORIES TO COVER ━━━
- Cathedral of giant bioluminescent mushrooms, caps 20 feet across, glowing blue-green
- Fallen tree trunk covered in shelf fungi forming a staircase of brackets
- Underground mycelium cave, walls threaded with white fungal networks, faint glow
- Fairy ring of red-capped amanitas in a dark clearing, spore dust in the air
- Rotting log interior, a miniature world of fungi, beetles, and moisture
- Bioluminescent forest floor at night, every surface covered in glowing fungi
- Peat bog edge where strange bracket fungi grow on drowned trees
- Root system intersection where mycelium networks converge in a nexus of threads
- Mushroom garden tended in a hollow tree, varieties carefully cultivated
- Rain-soaked forest floor after a storm, thousands of new mushrooms erupting
- Cave entrance with stalactites of crystallized mycelium
- Ancient stump transformed into a tower of overlapping shelf fungi

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: fungi type + scale (tiny/massive) + light source (bio/ambient/dark).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
