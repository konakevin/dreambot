#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_surprise_element.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} FESTIVAL-NIGHTS SURPRISE-ELEMENT entries — small matsuri secondary subjects at midground or background. Each 10-18 words. Element + placement + festival-world implication.

VARIETY:
- 20% CHOCHIN-LANTERN-CLUSTER (paper-lantern string overhead at midground / single chochin glowing warm at midground / lantern-tower at background)
- 16% YATAI-VENDOR-IN-DISTANCE (takoyaki-vendor at midground stall mid-flip / kakigori-cart vendor at distance / candy-apple seller in deep distance)
- 12% IMPLIED-FRIEND-FIGURE (friend figure silhouette in deep distance with sparkler / partner-shape at midground stall / friend on bench beyond)
- 10% KINGYO-IN-BAG (plastic goldfish-bag swinging at midground / friend with caught goldfish nearby / tank with kingyo at midground)
- 10% FIREWORK-BURST-BACKGROUND (firework-burst high in midground sky — NOT focal / hanabi-blossom distant overhead / sparkler-trails in deep midground)
- 8% MIKOSHI-PORTABLE-SHRINE (mikoshi-shrine carried by group in midground / shrine-float distant / mikoshi-rope-bearers passing)
- 8% BON-ODORI-DANCERS (dancers in circle at midground / yagura-tower in distance with drummers / bon-odori line in deep distance)
- 6% FALLEN-PETAL-OR-LEAF (paper-confetti drifting close at midground / fallen festival-flyer / paper-streamer caught on stall)
- 6% TANABATA-WISH-STRIPS (bamboo with paper-tanzaku strips fluttering at midground / wish-strips on tree / paper-fortune omikuji tied at branch)
- 4% CAT-OR-DOG-AT-FESTIVAL (street-cat watching from wall / dog tied at stall / pet on owner's shoulder)

DO write:
- Chochin paper-lantern string overhead at midground, twenty lanterns glowing warm amber along stall-row
- Takoyaki yatai-vendor in indigo jinbei at midground stall mid-flip with octopus-balls and steam
- Implied-friend silhouette in deep distance with sparkler-glow on face, blurred-warm
- Plastic kingyo-bag with three goldfish swinging at midground beside character's hand
- Firework-burst high in midground sky behind lantern-string, golden-pink chrysanthemum-bloom — character NOT looking at it
- Mikoshi portable-shrine carried by group in midground, gold-and-red lacquer flashing
- Bon-odori dancers in concentric circle at midground around yagura-tower, yukata-sleeves catching air
- Paper-tanzaku wish-strips fluttering at midground bamboo, pink yellow green white pastels
- Street-cat sitting on stone-wall at midground watching the festival pass, ears back

DO NOT: anything foreground competing with character / multiple per entry / dramatic / character back-to-camera staring at element.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
