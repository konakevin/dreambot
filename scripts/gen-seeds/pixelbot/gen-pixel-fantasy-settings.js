#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_fantasy_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FANTASY SETTING descriptions for PixelBot's pixel-fantasy path. Each entry is a fantasy LOCATION/ENVIRONMENT. The creature or being will be picked separately.

Each entry: 10-20 words. A specific fantasy environment.

━━━ CATEGORIES TO COVER ━━━
- Castles and towers (crumbling ruins, glowing throne rooms, floating citadels)
- Enchanted forests (crystal trees, glowing fungi, fairy-lit canopy)
- Dungeons and caves (treasure vaults, dragon lairs, underground lakes)
- Magical cities (wizard towers, alchemist streets, floating market)
- Elemental realms (fire mountain, ice palace, storm peak, water temple)
- Dark zones (cursed swamp, shadow realm, haunted battlefield)
- Sacred spaces (ancient temple, moonlit shrine, world-tree roots)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: environment archetype + mood (light/dark/neutral).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
