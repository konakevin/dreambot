#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_setting.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} FESTIVAL-NIGHTS SETTING entries — Japanese matsuri / hanabi / yatai places where character is ENGAGED (facing camera or partner, NOT staring at fireworks back-to-camera). Each 14-22 words. Setting + tactile foreground + midground + engagement-context.

⚠️ CRITICAL: NEVER "standing watching distant fireworks", NEVER "back-to-camera looking at sky", NEVER "facing-away admiring the display". These are the genre's named failure modes. Character is ENGAGED with stall / food / partner / object.

VARIETY:
- 18% YATAI-STALL-ROW (takoyaki-stall front with sauce-brushes close / kakigori-cart with syrup-bottles / kingyo-sukui tank with goldfish / candy-apple stall / ramune-cooler stall — character AT the counter)
- 14% SHRINE-GROUNDS-MATSURI (torii-gate approach with paper-lanterns close / shrine-courtyard with omikuji-trees / shrine-steps with stalls flanking — character on path engaged)
- 12% SUMIDA-RIVERSIDE-HANABI (riverside path with paper-lanterns hung close, fireworks-glow midground, water with reflections beyond — character BESIDE friend mid-laugh, NOT facing river)
- 10% ASAKUSA-FESTIVAL-STREET (Asakusa shopping-street with chochin-strings overhead close, stall-fronts midground, Sensoji pagoda beyond — character mid-stride toward camera)
- 10% TANABATA-BAMBOO-WISH (bamboo-grove with paper-wish strips close, candle-lanterns midground, festival-stage beyond — character tying wish-strip facing camera)
- 8% KYOTO-GION-MATSURI (yamaboko festival-float with carved-detail close, lantern-string midground, Kyoto-machiya houses beyond — character at float-base mid-look-up)
- 8% BON-ODORI-YAGURA (yagura-tower platform with taiko-drummer close, dancers in circle midground, chochin-ring overhead beyond — character in dance-circle facing inward)
- 6% TEMPLE-FAIR-LANTERN-PATH (lantern-path with stone-lanterns close, paper-lanterns strung overhead midground, temple beyond — character mid-walk facing camera)
- 6% FESTIVAL-ISLAND-PIER (pier with paper-lantern string close, river-lanterns floating midground, far-shore fireworks beyond — character mid-release-lantern)
- 4% SCHOOL-CULTURAL-FESTIVAL (school-festival booth with handmade-signs close, class-stall midground, school-building beyond — character at booth-counter facing camera)
- 4% SHRINE-FOOD-COURT (food-court bench with takoyaki-tray close, yatai-stalls midground, shrine-gate beyond — character mid-bite at bench)

DO write:
- Takoyaki yatai-stall front with grill-tray close foreground, sauce-bottles midground, lantern-strings beyond — she stands AT counter mid-order facing vendor
- Shrine grounds with stone torii-approach and paper-lanterns close, omikuji-fortune-trees midground, shrine-stairs beyond — he ties wish to twig facing camera
- Sumida riverside path with chochin-string close overhead, friend-group midground, fireworks-glow beyond — she turns to friend mid-laugh
- Asakusa festival-street with lantern-string canopy close, yatai-rows midground, Sensoji pagoda beyond — he walks toward camera mid-stride
- Bamboo grove with paper-wish strips close, candle-lanterns clustered midground, festival-stage beyond — she ties tanzaku-strip facing forward
- Bon-odori yagura platform with taiko-drum close, dancers in circle midground, chochin-ring overhead beyond — she dances mid-clap facing center

DO NOT: "standing at edge watching distant fireworks" / "back-to-camera silhouette under hanabi" / "facing-away admiring display" / "looking up at sky from below". Photoreal cinematography. Multiple per entry.

Every setting affords ENGAGED-WITH-stall/partner/food. Fireworks present but in MIDGROUND or BEYOND, NEVER the focal point character is fixated on.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
