#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/camera_angles.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CAMERA ANGLE / SHOT FRAMING descriptions for StarBot — cinematic camera compositions for sci-fi scenes. 15-25 words each.

━━━ WHAT THESE ARE ━━━
Each entry describes a specific camera position, angle, lens choice, and framing approach. These get injected into sci-fi scene prompts to force variety in how scenes are composed. They should describe WHERE the camera is and HOW it sees the scene — NOT what's in the scene.

━━━ SHOT CATEGORIES (spread EVENLY — max 2 per category) ━━━
1. Low angle looking up — ground-level, worm's-eye, looking up at scale and grandeur
2. High angle looking down — overhead, bird's-eye, looking down into a space or landscape
3. Dutch angle/tilt — diagonal framing, tension and unease, canted horizon
4. Extreme wide/establishing — tiny subject against vast environment, scale shot
5. Medium shot — waist-up framing, balanced environment and subject
6. Close-up/macro — tight on detail, texture fills frame, shallow depth of field
7. Over-the-shoulder/POV — first-person perspective, looking through/past something
8. Through-frame/foreground framing — shooting through doorways, arches, machinery, vegetation
9. Tracking/dolly perspective — implied camera movement, following a path or trajectory
10. Symmetrical/centered — Kubrick-style centered composition, vanishing point, geometric precision
11. Split composition — strong diagonal or horizontal divide, two contrasting zones
12. Reflection shot — scene reflected in visor, water, metal surface, mirror
13. Silhouette framing — subject backlit against bright background, shape and outline dominant

━━━ DEDUP ━━━
No two entries should share the same camera height + angle + lens feel:
- HEIGHT: ground-level, knee-height, eye-level, elevated, overhead, extreme-high
- ANGLE: looking up, straight-on, looking down, tilted, diagonal
- LENS: wide-angle, normal, telephoto, macro, anamorphic, fisheye

━━━ RULES ━━━
- Describe ONLY camera position and framing — NOT scene content
- Include lens/depth-of-field language where relevant (shallow DOF, deep focus, anamorphic stretch)
- These must work for ANY StarBot scene — interiors, exteriors, landscapes, characters, structures
- Cinematic film language — think storyboard direction, not Instagram filters
- 15-25 words per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
