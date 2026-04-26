#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/ice_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ARCTIC/ICE SETTING descriptions for MermaidBot's mermaid-ice path. Frozen seas, glacial caves, polar waters, aurora-lit surfaces. Cold, crystalline, vast.

Each entry: 10-20 words. A specific arctic aquatic environment.

━━━ CATEGORIES TO COVER ━━━
- Ice cave interior with turquoise glacier walls and still dark water
- Frozen surface with a breathing hole, aurora borealis reflecting in the water
- Iceberg underwater, massive blue-white wall descending into darkness
- Arctic sea with ice floes, midnight sun low on the horizon
- Glacial meltwater pool, crystal blue, tiny ice crystals suspended
- Frozen waterfall with water still flowing behind a curtain of ice
- Polar sea floor with pale sand, sea stars, and cold-water coral
- Ice shelf edge where glacier meets open ocean, calving blocks tumbling
- Snow-covered rocky shore with steaming hot spring meeting frozen sea
- Underwater ice tunnel connecting two frozen pools, light filtering through ice

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: ice formation type + light source (aurora/sun/moon/bioluminescent).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
