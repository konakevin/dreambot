#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/water_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} AQUATIC / COASTAL ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific water-dominated ancient scene. Pre-600 BC ONLY.

These civilizations lived WITH water — on islands, along coasts, over marshes, beside lakes. Water is not background, it is PART of the architecture and life.

━━━ SCENE TYPES (mix across all) ━━━
- Phoenician island cities (Tyre on its island fortress, sea walls pounded by waves, purple-dye vats along shore)
- Minoan coastal towns (painted buildings stepping down to harbor, dolphin frescoes visible from the sea, bright Mediterranean light on white plaster)
- Marsh/stilt settlements (reed houses on platforms over water, dugout canoes between dwellings, fish drying on racks, Mesopotamian marshlands)
- Flooded Nile temples (annual inundation lapping at temple steps, sacred lake reflecting pylons, lotus-choked waterways between monuments)
- Lake dwellings (Bronze Age crannog settlements, wooden platforms over still water, smoke rising from thatched roofs, mountain reflections)
- Island sanctuaries (Philae-style temple islands, sacred groves surrounded by water, processional causeways half-submerged)
- Coastal quarries and shipyards (cedar logs floated down rivers, Phoenician ship-building beaches, limestone blocks loaded onto barges)
- Reed-boat fleets (papyrus vessels on the Nile, reed boats of Lake Titicaca precursors, fishing fleets at dawn)
- Underwater ruins glimpsed through clear shallows (submerged harbor stones, reef growing on ancient breakwaters)
- Coastal cliff settlements (sea-cave dwellings, cliff-face tombs above crashing waves)

━━━ RULES ━━━
- Each entry is ONE specific water-dominated scene with civilization baked in
- WATER must be prominent — reflections, waves, mist, flooding, still lake surface
- Include specific period details (reed construction, bitumen waterproofing, cedar hulls, limestone quays)
- 25-40 words
- NO medieval, NO Greek/Roman, NO fantasy
- Spread across many civilizations, not just Phoenician

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
