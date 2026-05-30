#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_archetype.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} FESTIVAL-NIGHTS ARCHETYPE entries — characters at Japanese matsuri / hanabi / yatai-festival. Shinkai / Your-Name / Anohana register. Both genders. 12-22 words each.

Format: Role + matsuri-coded tone + signature visual.

VARIETY (both genders):
- 18% FESTIVAL-GOER (high-school friend group attendee / college pair at hanabi / family with kids / solo first-festival)
- 14% YATAI-VENDOR (takoyaki-stall vendor in jinbei / kakigori-vendor with apron / kingyo-sukui game-master / candy-apple seller / ramune-stall owner)
- 12% SHRINE-ATTENDANT (miko shrine-maiden in white-and-red / shrine-priest in matsuri-haori / temple-helper handing omikuji)
- 10% SHY-TEEN (first-festival shy first-year / nervous date-companion / quiet sibling-tag-along)
- 10% OLDER-SIBLING (older-brother walking sibling through stalls / older-sister adjusting little-sister's obi / cousin-pair)
- 8% FRIEND-WITH-FRIEND (best-friend duo sharing kakigori / pair-with-sparklers / classmate-group photo)
- 8% PERFORMER (bon-odori dancer in yukata / taiko-drummer in happi / mikoshi-bearer in fundoshi-and-happi modest)
- 6% CHILD (small kid with goldfish-bag / child clutching mask at stall / toddler on father's shoulders watching fireworks)
- 6% ELDER-LOCAL (grandmother in formal-yukata / grandfather adjusting grandchild's geta)
- 4% OUT-OF-TOWN-VISITOR (university-student from Tokyo visiting hometown festival / tourist-couple navigating yatai-row)
- 4% LANTERN-LIGHTER (volunteer adjusting chochin-lantern string / shrine-helper lighting paper-lanterns)

DO write:
- High-school festival-goer in yukata mid-laugh with friend, register: warm summer-night-joy
- Takoyaki yatai-vendor in navy jinbei mid-flip with tongs, register: focused-craftsman
- Miko shrine-maiden in white-and-red mid-handing-omikuji, register: serene-formal
- Older brother adjusting little-sister's obi at festival entrance, register: tender-protective
- Bon-odori dancer mid-twirl in pale yukata, register: graceful-celebratory

DO NOT: cheesecake-coded / yukata-half-falling / suggestive / multiple per entry / modern-streetwear (this is a traditional matsuri).

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
