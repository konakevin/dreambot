#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/spore_light_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT FOREST SETTING descriptions for FaeBot's spore-light path. This is a PURE LANDSCAPE path — NO characters, NO creatures, NO people. Glowing mushroom forests, mycelium caves, spore-filled hollows. Everything bioluminescent. ALWAYS nighttime or deep underground.

Each entry: 10-20 words. A specific bioluminescent forest environment.

━━━ CATEGORIES TO COVER ━━━
- Cathedral of giant bioluminescent mushrooms, caps 30 feet across, casting blue-green light on the forest floor
- Underground mycelium cave where every surface is threaded with glowing white fungal networks
- Fallen tree trunk completely colonized by shelf fungi, each bracket a different color of bioluminescence
- Forest floor after rain, thousands of tiny mushrooms erupting, each one a pinpoint of light
- Hollow inside a massive dead tree, walls covered in glowing mycelium patterns like circuits
- Fairy ring of enormous toadstools, the space inside lit by their combined glow
- Moss-covered ravine where bioluminescent spores drift upward like reverse snow
- Root system of a giant tree exposed by erosion, every root wrapped in glowing mycelium
- Bog at midnight where fungi growing on submerged logs create an underwater lightshow
- Cliff face covered in bioluminescent lichen, the entire rock wall glowing like stained glass
- Network of fallen branches on the forest floor, each one a highway of glowing mycelium
- Ancient stone ruins being consumed by bioluminescent fungi, the architecture outlined in light

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: substrate (tree/ground/stone/water) + fungi type (mushroom/mycelium/lichen/spore) + scale.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
