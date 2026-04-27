#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/nymph_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST NYMPH ACTION descriptions for SirenBot's forest-nymph path. Each entry is what a woodland spirit is DOING in her enchanted forest — tending nature, interacting with the living forest. Unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific nature-spirit action.

━━━ CATEGORIES TO COVER ━━━
- Coaxing a sapling upward from the soil with outstretched glowing hands
- Stepping barefoot across a stream on mossy stones, arms out for balance
- Weaving flower vines into a living archway between two trees
- Pressing her palm against an ancient tree trunk, bark patterns spreading from her touch
- Catching falling leaves and releasing them as butterflies
- Kneeling at a spring, cupping water that glows as she lifts it
- Climbing a massive oak, fingers finding holds in the bark effortlessly
- Releasing fireflies from her cupped hands into the twilight canopy
- Running through a meadow, wildflowers sprouting in her footprints behind her
- Mending a broken branch by holding the pieces together until they fuse
- Listening with her ear against a tree trunk, eyes closed in concentration
- Gathering dewdrops from spider webs into a leaf-cup

━━━ BANNED ━━━
- Sitting / lying passively / meditating / watching quietly
- "Posing", "modeling", looking at the camera
- Second figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + nature element involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
