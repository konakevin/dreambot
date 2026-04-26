#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_horror_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} PIXEL HORROR SETTING descriptions for PixelBot's pixel-horror path. Retro survival-horror pixel game energy — Clock Tower, Lone Survivor, Darkwood, old RPG Maker horror. Each entry is a specific creepy LOCATION. The dread element will be picked separately.

Each entry: 10-20 words. A specific horror environment.

━━━ CATEGORIES TO COVER ━━━
- Haunted buildings (Victorian mansion, abandoned asylum, decrepit hotel, cursed school)
- Forests (fog-choked woods, dead-tree forest, swamp with gnarled roots)
- Towns (silent village, boarded-up main street, carnival after closing)
- Underground (flooded basement, crypt corridors, mine shaft, sewer tunnels)
- Isolated (lighthouse on rocky shore, cabin in snowstorm, graveyard hill)
- Surreal/liminal (infinite hallway, room that shouldn't exist, staircase going nowhere)
- Industrial (abandoned factory, rusted ship interior, power plant at night)
- Religious (corrupted chapel, candlelit catacombs, overgrown monastery)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location archetype + isolation level (urban/rural/underground).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
