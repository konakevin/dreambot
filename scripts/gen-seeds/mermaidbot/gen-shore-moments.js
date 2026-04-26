#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/shore_moments.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SHORE MERMAID MOMENT descriptions for MermaidBot's mermaid-shore path. Each entry is what a mermaid is DOING at the boundary of ocean and land — curious about the human world, caught between realms. Dynamic freeze-frames.

Each entry: 15-25 words. A specific liminal moment.

━━━ CATEGORIES TO COVER ━━━
- Reaching for a glass bottle washed ashore, examining the label with curiosity
- Pulling herself onto sun-warmed rocks, tail still trailing in the surf
- Watching a distant ship through sea spray, longing in her expression
- Tracing patterns in wet sand with her fingertips as waves erase them
- Collecting sea glass and smoothed pottery shards from the tide line
- Half-submerged in a tidepool, chin resting on folded arms on the rock edge
- Catching raindrops in her palms as a storm rolls in from the sea
- Braiding seaweed and wildflowers picked from the cliff edge above
- Pushing off from a dock piling back into deeper water, reluctant
- Surfacing just enough to peer over a rock at a coastal path

━━━ BANNED ━━━
- Sitting / lying flat passively
- "Posing", "modeling"
- Humans visible in frame
- Interacting with humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + human-world object involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
