#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROMANCE ACTION entries — tender mid-moments. FORWARD-FACING ONLY.

⚠️ Never "looking out at sakura distance" / "walking away under blossoms" — back-to-camera traps.

Each 12-20 words. Action + body orientation + face register.

VARIETY:
- 16% MID-BLUSH (mid-blush hands raised to flushed face / mid-shy face turned toward viewer with cheek-glow / mid-coy-glance)
- 14% MID-LETTER (mid-write love-letter eyes up at viewer / mid-fold-letter with tender-smile / mid-read-letter with hand-over-mouth)
- 12% MID-FLOWER-OFFERING (mid-offer-flower toward camera / mid-receive-flower with smile / mid-pluck-blossom from branch facing viewer)
- 10% MID-CATCH-PETAL (mid-catch petal in hand facing camera / mid-toss handful of petals / mid-twirl-with-petals)
- 10% MID-LAUGH-TENDER (mid-laugh head-back with eyes-closed joy / mid-giggle into hand / mid-smile face glowing)
- 8% MID-PIANO/INSTRUMENT (mid-play piano with focused tender face / mid-strum-guitar with eyes-closed concentration / mid-violin-stroke face visible)
- 8% MID-LOOK-UP (mid-look-up at falling petals with face dominant / mid-glance-up at someone off-frame / mid-eyes-meet camera)
- 6% MID-WAVE (mid-wave at off-frame friend with bright smile / mid-greet at door / mid-call-out tender)
- 6% MID-PROFILE-TENDER (full profile mid-walk with petals catching hair / profile mid-cycle through petals)
- 6% MID-TOUCH-OBJECT (mid-touch-photograph with finger / mid-press-flower in book / mid-hold-letter to chest)
- 4% MID-CONFESSION (mid-extend-letter toward camera / mid-take-deep-breath face flushed / mid-look-down-shy)

DO write:
- Mid-blush hands raised cupping flushed cheeks, eyes wide tender facing camera, petals catching hair
- Mid-write love-letter at desk by window, eyes up at viewer with shy half-smile, pen mid-stroke
- Mid-offer single white rose toward camera, fingers gentle on stem, soft tender smile forward 3/4
- Mid-catch cherry-petal in cupped hand facing camera, eyes warm wonder, smile dawning
- Mid-laugh head-back tossing twin-tails with eyes-closed joy, petals lifting around her
- Mid-play piano with focused tender face turned slightly up at viewer-side, keys glowing in golden hour

DO NOT: walking-away / facing-away-to-admire / looking-out — back-to-camera traps. Cheesecake-suggestive. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
