#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_action.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} KAWAII ACTION entries — cute mid-moments. FORWARD-FACING ONLY.

⚠️ Never "looking out at view" / "walking away" / "facing background". She's engaged in cute moment.

Each entry: 12-20 words. Action + body orientation + face register.

VARIETY:
- 18% MID-GIGGLE (mid-laugh toward camera with hand at mouth / mid-giggle tossing head back / mid-snicker peeking through fingers)
- 14% MID-HUG (mid-hug-plushie tight against chest face dominant / mid-hug-mascot / mid-cuddle-pet on shoulder)
- 12% MID-BLUSH (mid-blush hands raised to flushed face / mid-shy with face turned toward viewer / mid-coy-glance)
- 10% MID-TWIRL (mid-twirl with skirt billowing toward viewer / mid-spin with hair caught / mid-pirouette)
- 10% MID-EAT-DESSERT (mid-bite of cake with sparkly eyes / mid-sip of boba with cheek-bulge / mid-spoon of parfait)
- 8% MID-WAVE (mid-wave with bright smile at viewer / mid-finger-heart at camera / mid-peace-sign cute)
- 8% MID-POSE (forward 3/4 cute idol pose / mid-curtsy bow / mid-jazz-hand kawaii pose)
- 6% MID-BUBBLE-BLOW (mid-bubble-wand-blow toward camera / mid-blow-kiss / mid-blow-confetti)
- 6% MID-SKETCH (mid-doodle-in-notebook face up at viewer / mid-letter-write / mid-paint-stroke)
- 8% MID-FAMILIAR-INTERACTION (mid-pet of mascot-cat at shoulder / mid-feed of bunny / mid-pat of plushie head)

DO write:
- Mid-laugh tossing head back, hand at mouth, twin-tails bouncing, eyes squeezed shut with joy facing camera
- Mid-hug-plushie tight against chest, face peeking over plushie head with happy half-smile at viewer
- Mid-blush hands raised cupping flushed cheeks, embarrassed cute look forward 3/4
- Mid-twirl with skirt billowing toward viewer at apex of spin, hair caught mid-arc
- Mid-bite of strawberry-shortcake with sparkly eyes, fork near mouth, expression delighted facing camera

DO NOT: "walking toward / approaching / facing away to admire" — back-to-camera traps. Cheesecake/sultry registers. Static-posing. Multiple actions per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
