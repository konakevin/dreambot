#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot meal-types renders. Each companion is a tiny kawaii creature or critter that sits near (NOT on top of) the kawaii food subject as a small delight — bird / bug / animal / plushie / paper-craft / sprite. They scale-prove the cuteness without stealing the scene.

Each entry: 10-18 words. ONE specific tiny companion with kawaii features.

━━━ DISTRIBUTION ━━━

- 5 TINY KAWAII BIRDS (sparrow / robin / bluebird / chickadee / canary, with smiling beak)
- 5 TINY KAWAII INSECTS (ladybug / bee / butterfly / firefly / dragonfly, with dot-eyes)
- 5 TINY KAWAII MAMMALS (mouse / hamster / squirrel / kitten / bunny, scale-tiny)
- 4 TINY PLUSHIE / FELT (bear / rabbit / chick / lamb / panda, hand-stitched read)
- 3 TINY PAPER / ORIGAMI (folded crane / boat / flower / hat / leaf with kawaii face)
- 3 TINY ABSTRACT KAWAII SPRITES (cloud / star / heart / sparkle / droplet, with face)

━━━ EXAMPLES ━━━

"Tiny round kawaii sparrow with smiling beak perched watching the subject from the side"
"A tiny pastel ladybug with dot eyes resting on a nearby leaf"
"A tiny round kawaii mouse with rosy cheeks holding a crumb beside the subject"
"A tiny felt bear plushie with stitched eyes sitting nearby like a friend"
"A tiny origami crane with painted kawaii face folded beside the scene"
"A tiny smiling-cloud sprite floating near the subject's head"

━━━ HARD MANDATES ━━━

- Companion is SMALL, never dominates
- Has kawaii face features (eyes / smile / blush)
- Sits NEAR the subject (not on top, not blending)

━━━ HARD BANS ━━━

- NO companions that are people / humans / robots / monsters
- NO companions that are food (food is the subject)
- NO color or palette language inside the companion entry

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
