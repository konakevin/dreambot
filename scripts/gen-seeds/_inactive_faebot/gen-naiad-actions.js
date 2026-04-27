#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/naiad_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} NAIAD ACTION descriptions for FaeBot's naiad path. Each entry is what a freshwater spirit is DOING in her stream or pool — she IS the water as much as she inhabits it. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific water-spirit action.

━━━ CATEGORIES TO COVER ━━━
- Rising from the surface of a pool, water streaming off her body like a second skin
- Directing the flow of a stream with a wave of her hand, redirecting currents
- Dissolving her legs into the waterfall, becoming part of the cascade
- Cupping water in her hands and lifting it above her head, forming a floating sphere
- Swimming upstream against a powerful current with effortless grace
- Sitting at the edge of a spring as water bubbles up around her waist
- Combing her liquid hair, droplets falling from it like rain
- Touching a dead fish and reviving it, releasing it back into the current
- Splashing playfully through shallows, her footsteps creating tiny geysers
- Drawing patterns on the water's surface that glow briefly before fading
- Merging with the waterfall, her silhouette visible within the cascade
- Catching a falling leaf before it touches the water, examining it curiously

━━━ BANNED ━━━
- Sitting / lying completely passively
- "Posing", "modeling", looking at the camera
- Second figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + water interaction type (merging/directing/playing/rising).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
