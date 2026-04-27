#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/moonwell_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MOONWELL SETTING descriptions for FaeBot's moonwell-keeper path. Sacred forest pools that collect moonlight and starlight, ringed by ancient stones, roots, crystals. ALWAYS nighttime, ALWAYS featuring a body of water.

Each entry: 10-20 words. A specific sacred-pool environment.

━━━ CATEGORIES TO COVER ━━━
- Circular pool ringed by standing stones, each stone carved with lunar symbols, silver water glowing
- Natural spring in a moss-covered grotto, the water surface perfectly still and reflecting stars
- Forest clearing where tree roots form a natural basin, filled with luminous silver water
- Ancient stone well in a ruined temple, moonlight pouring directly down the shaft
- Cascade of small pools stepping down a hillside, each one catching moonlight at a different angle
- Frozen moonwell in winter, the ice glowing from within, moonlight trapped in crystal
- Underground cavern pool fed by a waterfall, the water glowing where moonbeams reach through a crack above
- Reflecting pool in a grove of silver birch trees, the white bark doubling in the water
- Tidal pool at the forest edge where the sea meets the trees, salt and moonlight
- Shallow basin carved into a flat stone summit, collecting dewdrops and starlight
- Hot spring steaming in a frozen forest, the mist catching moonbeams, silver fog rising
- Crystal-lined pool where the water itself seems to be liquid light, almost too bright to look at

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: water type (pool/spring/well/cascade/tidal) + surrounding material (stone/root/ice/crystal).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
