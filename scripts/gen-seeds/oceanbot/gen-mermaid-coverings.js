#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_coverings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID CHEST COVERING descriptions for OceanBot's mermaid-legend path. What covers her chest — natural ocean materials only, nothing modern, nothing that looks like clothing.

Each entry: 4-10 words. A specific natural covering for her chest/torso.

━━━ EXAMPLES (use as inspiration, don't copy verbatim) ━━━
- Seashells arranged across her chest
- Draped seaweed and kelp covering her chest
- Knotted fishing net wrapped around her torso
- Wet sand and crushed shells clinging to her skin
- Strands of pearls and coral across her chest
- Woven kelp bralette tied at the back
- Barnacle-crusted shell pieces covering her chest
- Strips of dried sea-fan coral laced across her torso
- Her own long hair draped across her chest
- A wrap of salvaged ship-canvas knotted at the shoulder

━━━ MATERIAL FAMILIES TO COVER ━━━
- Shells: scallop, abalone, conch, cowrie, clam, mussel
- Seaweed/kelp: woven, draped, knotted, braided
- Netting/rope: salvaged fishing net, hemp rope, ship rigging
- Coral/reef: sea-fan, brain coral, finger coral
- Pearl/jewel: pearl strands, mother-of-pearl scales
- Salvaged materials: torn sail canvas, weathered leather, copper sheathing
- Natural: her own hair, wet sand, barnacles, starfish
- Scale/organic: her own scales extending up, shark-skin wrap

━━━ RULES ━━━
- Must COVER her chest — no bare/exposed entries
- Natural ocean materials ONLY — no modern fabric, no clothing, no swimwear
- Keep it tasteful and mythical — she is a sea creature, not a model
- Vary the material family — no two entries from the same family

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
