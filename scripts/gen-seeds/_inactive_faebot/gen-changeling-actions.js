#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/changeling_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CHANGELING ACTION descriptions for FaeBot's changeling path. Each entry is what a fae changeling is DOING — mimicking human behavior slightly wrong, exploring human objects with alien curiosity, shifting between her fae nature and human disguise. She is TRYING to pass as human and ALMOST succeeding. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific uncanny-valley action.

━━━ CATEGORIES TO COVER ━━━
- Arranging wildflowers in a vase with mathematical precision, each flower exactly equidistant
- Trying on a human dress, buttoning it wrong, studying herself in a dusty mirror
- Holding a spoon and staring at it, trying to remember how humans eat
- Standing at a window watching human children play, her head tilted at an unnatural angle
- Picking up a doll and examining it with intense fascination, turning it in her too-long fingers
- Braiding her own hair while looking at a portrait on the wall, copying the style imperfectly
- Walking through a doorway and pausing, touching the frame as if the concept of doors is new
- Collecting human objects — a button, a thimble, a key — arranging them in a circle
- Practicing a smile in the reflection of a window, the expression almost but not quite right
- Stepping from the forest into a garden, her bare feet leaving frost prints on the grass
- Touching a cat that arches away from her, confusion on her too-perfect face
- Opening a book and holding it upside down, running her finger along the text right to left

━━━ BANNED ━━━
- Sitting still / sleeping / hiding
- "Posing", "modeling", looking at the camera
- Scary or horror-movie actions (she is UNCANNY, not terrifying)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary interaction type (object/mirror/animal/movement) + specific wrongness detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
