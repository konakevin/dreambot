#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/lighting.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for AncientBot's ancient civilization scenes. Each entry is 10-20 words describing a specific dramatic lighting condition. These compose with separate scene pools — describe ONLY the light quality.

━━━ LIGHTING TYPES (mix across all) ━━━
- Golden hour (low amber sun raking across carved stone, long shadows from columns and statuary)
- Desert noon (harsh overhead sun, deep black shadows under colonnades, heat shimmer on stone)
- Storm dramatic (bruised purple sky, single shaft of gold through cloud break, wet stone gleaming)
- Dawn (pale rose and gold, first light catching the highest point of a monument, cool blue shadows below)
- Dusk/twilight (deep orange horizon, purple overhead, oil lamps being lit, stars appearing)
- Torchlight interior (warm flickering orange on painted walls, deep dancing shadows, smoke-hazed ceiling)
- Oil lamp glow (soft amber pools of light in dark temple interiors, gleaming gold surfaces)
- Moonlight (blue-silver wash on stone, sharp shadow edges, stars visible)
- Dust-filtered (golden light diffused through airborne desert dust, soft glowing atmosphere)
- River reflection (water bouncing light up onto building faces, ripple patterns on ceilings)
- Fire ceremony (large ceremonial fire casting orange light upward, dramatic underlighting on architecture)

━━━ RULES ━━━
- Each entry is ONE specific lighting condition
- Describe the light's COLOR, DIRECTION, and QUALITY — not visible beams or rays
- Include how the light interacts with ancient materials (stone, bronze, gold, painted plaster)
- 10-20 words
- Dramatic and painterly — this is oil-painting light, not photography

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
