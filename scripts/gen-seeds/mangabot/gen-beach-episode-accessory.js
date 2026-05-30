#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_accessory.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} BEACH-EPISODE ACCESSORY entries — summer vacation objects the character is holding/wearing. Wholesome K-On!/Free!/Lucky-Star tone.

Each 10-18 words. Object + tactile-summer detail.

VARIETY:
- 14% SURF/SWIM GEAR (surfboard tucked under arm / boogie-board against hip / kickboard / snorkel-mask up on forehead / goggles around neck)
- 12% FOOD/DRINK (shaved-ice cone in hand mid-melt / coconut with straw / popsicle stick / yakisoba in tray / ramune bottle with marble)
- 10% SAND-PLAY (sand-castle bucket + shovel / sand-mold-fish / sand-pail with shells)
- 10% PHOTOGRAPHY (disposable camera mid-snap / Polaroid in hand / waterproof phone in waterproof-pouch)
- 8% INSTRUMENT (ukulele held casual / harmonica between hands / tambourine for beach-bonfire)
- 8% READING/HOBBY (manga splayed open on towel / sketchbook with seascape sketch / paperback with sand on pages)
- 8% BEACH-GEAR (parasol-handle held high / beach-mat rolled under arm / cooler-handle gripped / picnic-basket)
- 6% WHISTLE/LIFEGUARD (whistle at lips mid-blow / clipboard with rescue-buoy / megaphone)
- 6% MUSIC/STEREO (portable Bluetooth-speaker / small boombox / wired earbuds dangling)
- 6% MARINE-FIND (shell cupped in palm / starfish balanced on hand / hermit-crab on finger)
- 6% PARTY (hand-sparkler mid-spark / paper-fan / festival yo-yo water-balloon / lantern unlit)
- 6% TOOL/SPORT (volleyball spinning on finger / beach-frisbee mid-grip / kite-string spool / fishing-rod)

DO write:
- Surfboard tucked under one arm, fin pointing back, wax-scuffed deck visible
- Shaved-ice cone topped with strawberry syrup mid-melt, plastic spoon in cup
- Sand-castle bucket and yellow shovel both gripped in same hand, sand sticking
- Disposable yellow waterproof camera held mid-snap toward off-frame friend
- Ukulele held casual across knees, fingers loose on neck, sandy strap
- Manga splayed open with sand-grains on glossy page, finger marking spot
- Beach-parasol handle gripped high, candy-stripe fabric overhead in frame
- Whistle at lips mid-blow with cord around neck, hand on hip
- Bluetooth-speaker held aloft with music-icon visible on screen, wrist-strap
- Cupped hands holding pink scallop-shell with sand pooling around it
- Hand-sparkler mid-spark held away from face, gold-spray visible
- Volleyball spinning on extended fingertip, ball mid-rotation

DO NOT: weapons / cheesecake / lingerie / suggestive props / photoreal-catalog / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
