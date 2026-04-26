#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/reef_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} REEF MERMAID ACTION descriptions for MermaidBot's mermaid-reef path. Each entry is what a playful, joyful tropical mermaid is DOING among the coral. Dynamic freeze-frames.

Each entry: 10-20 words. A specific playful action.

━━━ CATEGORIES TO COVER ━━━
- Spiraling upward through a column of sunbeams with arms outstretched
- Chasing a sea turtle through a coral canyon, laughing
- Weaving flower-like sea anemones into a garland
- Beckoning to a curious octopus with an outstretched finger
- Gliding belly-up through a coral archway, watching the sun above
- Catching drifting jellyfish in cupped hands, their glow reflected in her eyes
- Racing alongside a school of barracuda at the reef edge
- Decorating her tail with bright coral fragments and shell beads
- Peeking around a massive brain coral at something just out of frame
- Twirling in a cloud of tropical fish that scatter and regroup

━━━ BANNED ━━━
- Sitting / lying / watching / resting passively
- "Posing", "modeling"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + companion creature.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
