#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/harbor_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ANCIENT HARBOR / PORT scene descriptions for AncientBot. Each entry is 15-25 words describing a bustling ancient harbor, port, or maritime trade scene. Pre-600 BC civilizations ONLY.

Harbors are where civilizations MEET — goods, languages, ideas flowing between cultures. These scenes should feel ALIVE with commerce and connection.

━━━ SCENE TYPES (mix across all) ━━━
- Phoenician harbors (cedar-wood loading, purple-dye workshops, merchant galleys, stone breakwaters)
- Egyptian riverports (papyrus barges, grain ships, obelisk transport barges, reed fishing boats)
- Minoan port towns (painted buildings, dolphin frescoes, wide harbor basins, octopus-ware pottery)
- Indus Valley dockyards (Lothal's engineered dock, standardized weights, bead-trading ships)
- Dilmun/Bahrain (trade crossroads, pearl-diving boats, Mesopotamian-to-Indus cargo transfer)
- Byblos harbor (ancient cedar trade to Egypt, stone quays, Pharaoh's ships)
- Coastal Phoenician colonies (early Carthage, trading posts along Mediterranean)
- Nile delta ports (ship-building yards, rope-making, sail-cloth weaving)

━━━ RULES ━━━
- Each entry is ONE vivid harbor/port scene
- Include SHIPS and WATER prominently
- Show the bustle of trade — loading, unloading, merchants haggling, goods piled on docks
- Vary the civilizations and port types
- 15-25 words
- NO medieval ships, NO Greek/Roman galleys, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
