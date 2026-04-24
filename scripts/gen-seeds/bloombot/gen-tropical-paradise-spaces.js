#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/tropical_paradise_spaces.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TROPICAL PARADISE space descriptions for BloomBot's tropical-paradise path. Each entry describes the SETTING ONLY — no specific flower types (a separate pool handles flowers).

Each entry: 15-25 words. One specific tropical/Hawaiian setting with atmosphere and camera angle.

━━━ SETTING TYPES (mix evenly) ━━━
- Open-air tropical conservatory with ocean visible through glass walls
- Hawaiian botanical garden — volcanic stone paths, koi ponds, tiki torches
- Beachside glass greenhouse — sand meeting stone floor, waves visible
- Jungle clearing garden — no glass, carved stone paths through canopy
- Volcanic hillside terraced garden — lava rock walls, steam vents
- Plantation estate greenhouse — colonial glass, sugar cane surrounds
- Waterfall garden — cascading falls through tiered beds, mist
- Tidal pool garden — volcanic rock pools, ocean spray, low tide
- Bamboo-framed hothouse — woven bamboo and thatch, steaming interior
- Rainforest canopy walkway — elevated bridges through tree crowns

━━━ CAMERA ANGLES (vary across entries) ━━━
- Ground-level through foliage toward ocean/jungle
- Bird's-eye through glass/canopy down into garden
- Through-doorway/archway framing
- Low-angle from stone path
- Wide establishing with landscape context
- Intimate corner/bench/lanai detail

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species or colors. Use only generic terms: "blooms", "flowers", "tropical plants", "floral explosion". A separate pool provides the specific flower arrangement.

━━━ TROPICAL ATMOSPHERE (include one per entry) ━━━
Trade winds, salt air, volcanic mist, afternoon rain shower, golden Pacific sunset, morning dew, humidity shimmer, monsoon clouds, tiki torch glow, moonlit surf

━━━ WILDLIFE (~25% of entries) ━━━
Monarch butterfly, gecko on warm stone, hummingbird, tree frog on wet leaf

━━━ DEDUP ━━━
Each entry must be a DIFFERENT setting + angle combo.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
