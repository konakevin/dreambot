#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/shore_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SHORE/LIMINAL SETTING descriptions for MermaidBot's mermaid-shore path. The boundary between ocean and land — tidepools, beaches, coastal rocks, half-submerged locations. Traces of the human world nearby but NO humans.

Each entry: 10-20 words. A specific shore/liminal setting.

━━━ CATEGORIES TO COVER ━━━
- Tidepool cluster at golden hour with sea stars and tiny crabs
- Weathered dock pilings at dawn, barnacle-covered, waves lapping gently
- Sandy cove sheltered by sea cliffs with a distant lighthouse beam
- Mangrove roots at the waterline, dappled light through tangled branches
- Rocky shoreline at sunset with sea spray catching amber light
- Abandoned rowboat half-sunk in shallows, wildflowers growing through the hull
- Sea cave entrance at low tide, wet sand and shallow pools
- Coral sand beach with coconut palms and turquoise shallows
- Fog-shrouded pier with rusted lanterns and coiled rope
- River mouth where fresh water meets salt, swirling murky-to-clear

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: shore type + time of day + human-world artifact present.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
