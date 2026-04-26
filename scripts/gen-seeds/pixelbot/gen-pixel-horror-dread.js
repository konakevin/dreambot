#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_horror_dread.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL HORROR DREAD ELEMENT descriptions for PixelBot's pixel-horror path. Each entry is a specific creepy visual detail, unsettling object, or horror signal that creates dread WITHOUT gore. The SETTING will be picked separately.

Each entry: 8-15 words. One specific dread-inducing visual detail.

━━━ CATEGORIES TO COVER ━━━
- Light disturbances (single flickering bulb, TV static glow, candle guttering in draft)
- Wrong shapes (shadow that doesn't match its source, figure in window, eyes in darkness)
- Environmental decay (peeling wallpaper revealing writing, floor stain, cracked mirror)
- Sound-implying visuals (piano with one key pressed, rocking chair still moving, phone off hook)
- Nature horror (too-many-legs insect, fungal growth on walls, birds circling overhead)
- Uncanny objects (porcelain doll facing wall, clock hands spinning backward, child's drawing)
- Weather (fog rolling in from nowhere, rain falling upward, unnatural stillness)
- Evidence (scratches on door interior, abandoned wheelchair, shoes arranged in circle)

━━━ RULES ━━━
- Atmospheric dread ONLY — no gore, no blood, no body horror
- Suggest wrongness, don't depict violence
- Retro pixel game energy, not shock horror

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: dread category + sensory channel (visual/auditory-implied/spatial).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
