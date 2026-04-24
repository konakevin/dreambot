#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/video_store.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} VIDEO STORE FRIDAY scene descriptions for RetroBot — the ritual of renting movies on Friday night, 1982-1998. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific video store scene or detail.

━━━ CATEGORIES ━━━
- VHS shelf walls (hand-lettered genre signs: Action, Comedy, Horror, New Releases)
- New Release wall (big plastic display boxes, "Be Kind Rewind" stickers)
- Horror section (dark corner, lurid cover art, curtained-off adult section nearby)
- Video game rental shelf (NES/SNES/Genesis cartridges behind counter)
- Candy/snack aisle near checkout (Raisinets, Mike & Ike, microwave popcorn)
- Membership card on counter (Blockbuster, Hollywood Video, mom & pop shop)
- Return slot (metal flap, stack of returns behind counter)
- Movie posters on walls (Coming Soon, Now Playing)
- Cardboard standees of movie characters
- Fluorescent lighting on bright carpet
- TV mounted on wall playing previews
- Drop box in parking lot at night
- Stack of VHS tapes on coffee table at home (weekend picks)
- Late fee notices
- "Please Rewind" machines

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1982-1998 era — VHS dominant, some early DVD transition at tail end
- The tactile experience: plastic cases, printed labels, dusty shelves
- Gender-neutral — everyone went to the video store

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
