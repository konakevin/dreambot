#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/ice_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ICE MERMAID ACTION descriptions for MermaidBot's mermaid-ice path. Each entry is what an arctic-adapted mermaid is DOING in frozen waters. Graceful, powerful, adapted to extreme cold. Dynamic freeze-frames.

Each entry: 10-20 words. A specific cold-water action.

━━━ CATEGORIES TO COVER ━━━
- Surfacing through a breathing hole in the ice, breath crystallizing in the air
- Gliding beneath a massive iceberg, trailing her fingers along the ice wall
- Singing to a pod of narwhals in the dark arctic water
- Breaking through thin ice with a powerful upward thrust of her tail
- Weaving between icicles hanging from a frozen cave ceiling
- Collecting ice crystals that form naturally on her outstretched palm
- Racing alongside a humpback whale through glacier-blue water
- Pressing her hand against the ice from below, light filtering through
- Spiraling down from a breathing hole, ice crystals trailing behind her
- Resting against a glacier wall, frost forming on her eyelashes and hair

━━━ BANNED ━━━
- Sitting / lying flat passively / meditating
- "Posing", "modeling"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + interaction with ice vs. marine life.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
