#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} FESTIVAL-NIGHTS ACTION entries — engaged matsuri mid-moments. FORWARD-FACING ONLY. Each 12-20 words.

⚠️ CRITICAL: NEVER "looking up at fireworks back-to-camera", NEVER "watching the display from behind", NEVER "facing-away staring at sky". This IS the genre's #1 failure mode. Action must be ENGAGED with food / stall / partner / object — face TOWARD camera or three-quarter.

Format: Action + body orientation + face register.

VARIETY:
- 14% MID-BITE-YATAI-FOOD (mid-bite takoyaki on skewer with cheek-puff facing camera / mid-bite ringo-ame candy-apple eyes-wide / mid-bite yakitori with sauce-on-lip / mid-chew kakigori spoon-in-mouth)
- 12% MID-POUR-KAKIGORI (vendor or self mid-pour kakigori syrup onto shaved-ice facing forward / mid-stir matsuri-drink / mid-sip ramune with marble visible)
- 12% MID-SCOOP-KINGYO (mid-scoop goldfish with paper-poi paddle eyes-down focused at tank with face visible to camera / mid-cheer after catching goldfish facing camera)
- 12% MID-SPARKLER (mid-cradle lit senko-hanabi sparkler with face glowing mid-laugh / mid-light sparkler with mid-smile face-forward / mid-hold sparkler at heart-level eyes-warm)
- 10% MID-UCHIWA-FAN (mid-fan self with uchiwa face cooled-flushed forward / mid-offer fan to friend facing camera / mid-tuck fan at obi looking down)
- 8% MID-BUY-MASK-AT-STALL (mid-pay-vendor at mask-stall face-toward-counter / mid-try-on kitsune-mask pushed up on forehead forward 3/4 / mid-receive-mask from vendor face-visible)
- 8% MID-LIGHT-LANTERN (mid-light paper-lantern with match face-glowing warm forward / mid-hand-lantern to friend facing camera / mid-release river-lantern face-down then up at viewer)
- 8% MID-DANCE-BON-ODORI (mid-clap bon-odori dance facing center of circle visible to camera / mid-twirl with yukata-sleeves catching air face-forward / mid-step in circle face profile-tender)
- 6% MID-POUR-SAKE (vendor mid-pour sake from bottle to cup facing camera / mid-toast at festival-bench eyes-on-friend / mid-sip sake with mid-laugh)
- 4% MID-TIE-WISH-TANZAKU (mid-tie tanzaku wish-strip to bamboo facing camera with mid-prayer face / mid-write-wish on paper at table forward)
- 4% MID-LAUGH-AT-FRIEND (mid-laugh head-tilted toward off-frame friend with festival-glow on cheek / mid-giggle into hand facing camera)
- 2% MID-LOOK-UP-WITH-FACE-VISIBLE (mid-glance-up at lantern-canopy with FACE STILL TURNED toward camera / mid-look-up but tilted 3/4 not full-rear)

DO write:
- Mid-bite takoyaki on skewer with cheek-puffed in delight, eyes wide bright facing camera
- Mid-pour kakigori shaved-ice syrup at stall counter, vendor or self forward 3/4 with focused care
- Mid-scoop kingyo goldfish with paper-poi paddle at tank, eyes down then glance up at viewer with mid-grin
- Mid-cradle lit senko-hanabi sparkler at chest-height, face glowing warm pink-amber mid-laugh forward
- Mid-fan self with round uchiwa held at chin, cheeks lantern-flushed facing camera with playful smile
- Mid-pay-vendor at kitsune-mask stall, coins extended toward counter, face turned 3/4 to viewer-side
- Mid-light small paper-chochin lantern with match in cupped hand, face glowing forward with focus
- Mid-clap bon-odori dance step in circle, yukata-sleeves catching air, face center facing camera with smile
- Mid-tie tanzaku wish-paper to bamboo branch facing forward, hand on knot with mid-prayer face
- Mid-laugh head-tilted toward off-frame friend, sparkler in hand, festival-glow on cheek

DO NOT: "looking up at fireworks back-to-camera" / "watching display from behind" / "facing-away in silhouette" / "back-to-viewer admiring hanabi" — these are the named failure mode. Cheesecake-suggestive. Multiple per entry. Yukata-slipping descriptors.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
