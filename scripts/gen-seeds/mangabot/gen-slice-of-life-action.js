#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_action.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE ACTION entries — mundane everyday moments captured. FORWARD-FACING ONLY.

⚠️ Never "walking away" / "looking out window" / "facing horizon" — back-to-camera traps.

Each entry: 12-20 words. Action + body orientation + face register + interaction-with-object.

VARIETY:
- 16% MID-SIP (mid-sip of coffee with eyes downward / mid-sip of tea face up at viewer / mid-bobble of cup at lip)
- 14% MID-EAT (mid-bite of pastry / mid-slurp of ramen / mid-spoon of curry / mid-chopsticks-to-bowl)
- 12% MID-WORK (mid-type at laptop with focused brow / mid-write at desk eyes up / mid-sketch with brow furrowed / mid-stir-pot)
- 10% MID-READ (mid-read with finger marking page / mid-turn-page / mid-look-up-from-book at viewer)
- 10% MID-COMMUTE (mid-yawn at station / mid-check-phone on train / mid-stretch on platform / mid-pause-at-vending-machine)
- 8% MID-PET (mid-pat of cat with smile / mid-feed of dog at park / mid-cuddle of pet on couch)
- 8% MID-CRAFT (mid-knit-stitch / mid-brush-stroke / mid-photo-snap mid-mid-cut-vegetable)
- 8% MID-RELAX (mid-stretch with arms raised / mid-yawn slow / mid-shrug-off-coat / mid-recline on couch)
- 6% MID-CONVERSE (mid-wave to off-frame friend / mid-call-out / mid-greet at door / mid-smile-back)
- 4% MID-WAIT (mid-glance-at-watch at bus-stop / mid-check-clock at desk / mid-wait-for-elevator)
- 4% MID-WALK-TOWARD-CAMERA (mid-stride toward viewer on path / mid-cross-intersection forward / mid-step-from-doorway forward)

DO write:
- Mid-sip of warm coffee, eyes downward at steam, half-smile, soft morning light at edge
- Mid-bite of strawberry-pastry at cafe-counter, focused-pleasure expression facing viewer
- Mid-type at laptop with focused brow, half-empty mug beside hand, late-night light
- Mid-pat of grey cat in lap with gentle smile at viewer, evening warmth in glass
- Mid-yawn at train-platform with hand-at-mouth, drowsy expression toward viewer

DO NOT: "walking toward [thing] in distance" / "looking out window" / "facing away to admire" — back-to-camera. Dramatic/magical/combat. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
