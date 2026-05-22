#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_action_moment.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} ACTION MOMENT entries for a MangaBot samurai-era keyframe. Each entry is a CANDID mid-beat — the verb-phase the figure is CAUGHT in. Never posed. Never head-on-camera modeling. Hidden-camera capture.

Each entry: 8-18 words. ONE specific action verb-phrase with body-language detail. Story-moment energy.

DO write (vary across solo + paired actions):
- Mid-draw — katana half-out of saya, weight shifted forward, hand at hilt
- Mid-step — foot just landed on a wooden bridge plank, weight transferring
- Kneeling at altar — head bowed, hands resting on knees, prayer-bead twist visible
- Sheathing katana — blade sliding home, slow exhale, eyes still on the fallen leaf below
- Mid-bow exchange — two figures bowed at 45 degrees, formal greeting between strangers
- Watching from a vantage — figure looks out across the valley, hand resting on hilt
- Mid-turn — figure pivots toward something behind, robe flaring with momentum
- Pouring tea — kneeling at a small portable tea-set, kettle tipped over the cup
- Adjusting straw hat — figure pulls the brim lower against the rain
- Mid-vow — two figures press palms together in solemn pact under a great gate
- Crossing a stream — careful step onto a wet stepping-stone, robe gathered in one hand
- Resting against a tree — back to the trunk, eyes closed, katana laid across knees
- Mid-strike — single katana arc frozen mid-motion, opponent's blade catching at angle
- Reading a scroll — kneeling on the floor, scroll unfurled across the table
- Lighting a lantern — wick caught flame, hand still cupped against the wind

DO NOT write:
- Posed model-stance (facing camera, sword raised heroic, "look at me")
- Specific named techniques (Battou-jutsu / Gatotsu / etc.)
- Gore / death depictions
- Modern actions (driving / typing / using phone)
- Eye-contact with viewer ("looking at the camera")
- Multiple actions per entry — ONE clear verb-phase

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
