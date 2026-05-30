#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROOFTOP-ACTION entries — CRITICAL FORWARD-FACING ONLY.

⚠️ THIS PATH IS THE ORIGINAL BACK-TO-CAMERA FAILURE MODE. The audit found rooftop-sunsets ALWAYS rendered as "back-of-character looking out over city". EVERY action entry must affirmatively position character ENGAGED with rooftop-prop / pet / instrument / food / person, FACING viewer or in profile — NEVER staring at distant city.

Each 12-20 words. Action + body orientation + face register + interaction.

VARIETY:
- 20% MID-EAT/DRINK (mid-bite of bento facing camera / mid-sip of coffee with steam, face up / mid-slurp of cup-ramen)
- 14% MID-PLAY-INSTRUMENT (mid-strum guitar facing camera / mid-blow-harmonica / mid-press-keys with focused face)
- 12% MID-READ-WRITE (mid-read with finger marking page face up at viewer / mid-write in notebook / mid-sketch on tablet)
- 10% MID-PET-INTERACTION (mid-pet of cat in lap with warm smile / mid-feed of dog at side / mid-cuddle of pet)
- 10% MID-PHOTO/CAMERA (mid-snap of selfie facing camera / mid-aim of tripod-camera / mid-review-photo on tablet)
- 8% MID-CHEF (mid-flip of skewer over grill / mid-stir of pot facing camera / mid-toss of salad)
- 8% MID-CONVERSE (mid-call into phone facing viewer / mid-laugh with hand-at-mouth / mid-wave at off-frame friend)
- 8% MID-LAUGH-WITH-FRIEND (mid-laugh with someone-implied / mid-cheer-with-drink at viewer / mid-toast-cup forward)
- 4% MID-WATER-PLANT (mid-water-watering-can with focus on plant in foreground / mid-prune-shears)
- 4% MID-LIGHT-LANTERN (mid-light-candle facing camera / mid-light-sparkler / mid-strike-match)
- 2% MID-PROFILE-ENGAGED (full-profile mid-walk across rooftop with rooftop-prop / profile mid-stretch facing horizon side-on)

DO write:
- Mid-bite of bento-rice ball facing camera, sunset-amber on cheek, focused-pleasure expression
- Mid-strum of acoustic guitar with focused half-smile, fingers on D-chord, body angled three-quarter forward
- Mid-pet of black cat in lap with warm smile turned slightly toward viewer, evening golden-hour
- Mid-snap of selfie with sunset reflected in phone-screen, face up at camera with relaxed smile
- Mid-flip of yakisoba in pan over rooftop-grill, focused chef-face toward dish with sunset glow

DO NOT — CRITICAL:
- "Looking out at city" / "gazing at sunset" / "staring at skyline" — back-to-camera traps
- "Standing at edge of rooftop facing horizon" — back-to-camera trap
- "Watching the sun set" — back-to-camera trap
- "Leaning on railing looking out" — back-to-camera trap
- "Silhouetted against sunset" — back-to-camera trap
- Cheesecake / dramatic / multiple per entry

Character ALWAYS engaged with rooftop-prop / pet / instrument / food / person. Sun-set is BACKDROP, never the target of their gaze.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
