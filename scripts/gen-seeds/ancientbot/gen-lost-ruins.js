#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/lost_ruins.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LOST RUINS / ARCHAEOLOGICAL DISCOVERY scene descriptions for AncientBot. Each entry is 15-25 words describing an ancient site as it appears in various states of ruin, excavation, or rediscovery. The romance of archaeology.

These show the TENSION between decay and grandeur — civilization peeking through millennia of earth, sand, and vegetation.

━━━ SCENE TYPES (mix across all) ━━━
- Half-buried in sand (desert dunes partially covering carved walls, wind-scoured stone, exposed column bases)
- Jungle/vegetation overgrown (vines threading through carved reliefs, trees growing from rooftops, roots splitting stone)
- Partially excavated (clean trenches revealing painted walls, exposed foundations, archaeologist's grid lines)
- Underwater/submerged (flooded temple halls, reef-encrusted columns, sunken harbor stones)
- Eroded by time (wind-worn statuary, rain-smoothed inscriptions, crumbling mud-brick returning to earth)
- Dawn/dusk discovery moment (first light hitting a newly exposed carving, golden hour on excavation site)

━━━ SITES TO DRAW FROM ━━━
Mohenjo-daro (Great Bath, citadel), Gobekli Tepe (T-pillars emerging from hillside), Knossos (partially reconstructed), Akrotiri (volcanic ash preservation), Ur (death pits, ziggurat), Catalhoyuk (layered settlement), Nimrud (lamassu), Palmyra (before destruction), Hattusa (lion gates), Caral (platform mounds), Malta temples, Stonehenge, Newgrange, Carnac, Abu Simbel (sand-buried)

━━━ RULES ━━━
- Each entry is ONE specific ruin scene
- Balance between DECAY and BEAUTY — these are gorgeous, not depressing
- Include specific archaeological details (exposed brick courses, painted plaster fragments, carved stone)
- Vary civilizations widely
- 15-25 words
- NO medieval ruins, NO Greek/Roman ruins, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
