#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/deep_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DEEP-SEA MERMAID ACTION descriptions for MermaidBot's mermaid-deep path. Each entry is what a deep-sea adapted mermaid is DOING in the abyss. Dynamic freeze-frames.

Each entry: 10-20 words. A specific action.

━━━ CATEGORIES TO COVER ━━━
- Gliding through a curtain of bioluminescent particles, fins spread wide
- Reaching toward a glowing deep-sea organism with curious fascination
- Hovering motionless in the dark, her own bioluminescence the only light
- Spiraling downward along a trench wall, trailing luminous wake
- Investigating ancient sunken relics half-buried in sediment
- Commanding a school of lanternfish with outstretched hands
- Weaving between hydrothermal vent chimneys, heat shimmer around her
- Surfacing from a deep-sea cave, silt swirling behind her
- Hunting in the dark, predator-still, eyes reflecting faint light
- Gathering bioluminescent organisms into a woven net of kelp

━━━ BANNED ━━━
- Sitting / lying / watching / meditating / resting passively
- "Posing", "modeling"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + movement direction.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
