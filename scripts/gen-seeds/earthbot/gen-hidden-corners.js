#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/hidden_corners.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} INTIMATE DISCOVERED NATURE descriptions for EarthBot — small secret places that feel like personal discoveries, quiet and magical.

Each entry: 15-25 words. One specific hidden natural scene. No people.

━━━ CATEGORIES (mix across all) ━━━
- Mossy creeks and streams (moss-covered boulders in shallow streams, trickling water over roots)
- Fern grottos (overhanging fern canopies, damp rock alcoves draped in maidenhair fern)
- Tide pools (anemone-studded rock pools, barnacle-crusted channels, shallow reef platforms)
- Forest clearings (sunlit glades in old growth, meadows ringed by ancient trees)
- Mushroom logs (bracket fungi on fallen oak, clusters of chanterelles, fairy ring in damp earth)
- Wildflower meadows (alpine flowers tucked in high valleys, lupine fields, hidden poppy drifts)
- Root caves and hollows (tree root chambers, hollow trunks with fern floors, undercut banks)
- Springs and seeps (natural springs bubbling through sand, mineral-stained seep walls)
- Lichen gardens (rock faces painted in orange and green lichen, lichen-crusted stone walls)
- Fallen tree ecosystems (nurse logs with seedlings, moss-draped deadfall, bark peeling in patterns)
- Secret waterfalls (thin cascades hidden behind boulders, rain-fed trickles in mossy ravines)
- Riverbank sanctuaries (quiet eddies, overhanging willows touching still water, pebble beaches)

━━━ RULES ━━━
- INTIMATE scale — these are close, personal, small discoveries, not grand vistas
- Emphasize texture, moisture, detail, and the feeling of stumbling upon something
- Real natural settings only — no fantasy elements
- No two entries should describe the same type of hidden corner
- 15-25 words each — tender, specific, tactile language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
