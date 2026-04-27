#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/willow_wisp_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WILLOW-WISP ACTION descriptions for FaeBot's willow-wisp path. Each entry is what a will-o'-the-wisp humanoid is DOING in the marshlands — drifting, luring, flickering, phasing. She is made of LIGHT AND MIST. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific ghostlight action.

━━━ CATEGORIES TO COVER ━━━
- Drifting just above the water's surface, her reflection broken into a thousand ripples of light
- Splitting into three separate lights that drift apart then slowly reform into one figure
- Reaching toward a distant lantern on a path, her arm stretching into a tendril of light
- Flickering rapidly between visible and invisible, afterimages hanging in the fog
- Rising from the surface of a bog pool, her body assembling from scattered points of light
- Trailing her fingers through the mist, carving glowing lines that fade slowly behind her
- Hovering at a fork in the path, her glow brightening down the wrong direction
- Passing through a tree trunk, her light diffusing through the wood and emerging from the other side
- Dancing alone in a clearing, her movements leaving light-trails like long-exposure photography
- Crouching at the water's edge, her reflection in the dark water glowing brighter than she does
- Dimming to near-invisibility then flaring back brilliant, the fog around her pulsing with each surge
- Drifting backward into deeper fog, her outline softening until only her eyes remain as two points of light

━━━ BANNED ━━━
- Standing still / sitting / resting / sleeping
- "Posing", "modeling", looking at the camera
- Interacting with other characters (she is ALWAYS alone)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary movement type (drift/split/phase/trail/flicker) + light behavior.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
