#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_accessory.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} FESTIVAL-NIGHTS ACCESSORY entries — matsuri objects the character is holding. Japanese summer festival props. Each 10-18 words.

Format: Matsuri object + tactile detail.

VARIETY:
- 18% UCHIWA/SENSU-FAN (round paper uchiwa fan held mid-fan / folded sensu fan tucked at obi / colorful round-fan with goldfish print)
- 14% YATAI-FOOD (takoyaki tray with skewer mid-bite / kakigori shaved-ice cup with syrup / cotton-candy on stick / candy-apple ringo-ame / yakisoba in paper-tray / dango skewer)
- 12% SPARKLER-FIREWORK (lit senko-hanabi sparkler in hand showering pink-white sparks / handful of unlit sparklers / firework-tube fountain)
- 10% KINGYO-GOLDFISH-BAG (water-filled plastic bag with goldfish swimming / kingyo-sukui paper-paddle poi held over tank / small bowl with caught goldfish)
- 10% CHOCHIN-LANTERN (small handheld paper-lantern glowing warm / lit chochin on bamboo-pole / paper-lantern tied to wrist)
- 8% MASK-FROM-STALL (kitsune-fox mask pushed up on forehead / oni-demon mask held to side / hyottoko mask gripped at strings)
- 8% RAMUNE-DRINK (glass marble-bottle ramune mid-sip / cold ramune bottle held with condensation / two ramunes shared)
- 6% OMIKURI-FORTUNE (folded paper-fortune omikuji in hand / tied-omikuji on twig / shrine-talisman omamori pouch)
- 6% PHOTO-PRINT (Polaroid of friend just taken / disposable-camera in hand / phone showing taken-photo)
- 4% TAIKO-BACHI (drumstick mid-strike position / pair of bachi held / bachi tucked at obi)
- 4% MIKOSHI-ROPE (rope-handle of mikoshi portable shrine / festival-rope tied around wrist / ribbon-streamer in fist)

DO write:
- Round paper uchiwa-fan held mid-fan, goldfish-pattern in red and white, wooden handle visible
- Takoyaki tray with three skewered balls, sauce-and-katsuobushi glistening, mid-bite-pose
- Lit senko-hanabi sparkler raining pink-white sparks at fingertips, ash-curl about to drop
- Plastic bag of water with three small kingyo goldfish swimming, ribbon-tie at top
- Small paper chochin-lantern in red glowing warm amber from inside, bamboo handle, kanji painted
- Kitsune-fox white-and-red mask pushed up on forehead, string-ties at temples
- Ramune-bottle mid-tilt with marble visible inside, condensation droplets on glass

DO NOT: weapons / dramatic / photoreal-catalog / multiple per entry / suggestive.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
