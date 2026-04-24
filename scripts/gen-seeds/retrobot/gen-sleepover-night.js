#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/sleepover_night.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} SLEEPOVER NIGHT scene descriptions for RetroBot — the ultimate childhood social event, 1980-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific sleepover scene or detail.

━━━ CATEGORIES ━━━
- Living room floor (sleeping bags, pillows, blankets in nest formation)
- Pizza boxes (half-eaten slices, grease stains, napkins, 2-liter bottles)
- TV playing a movie (VHS horror movie glow, late-night channel static, infomercials)
- Game controllers scattered (NES, SNES, Genesis controllers, cartridges on floor)
- Board games mid-play (Monopoly money scattered, Risk board, Clue cards)
- Blanket fort (chairs draped with sheets, flashlight inside, comic books)
- Prank call setup (cordless phone, giggling evidence, phone book open)
- Junk food spread (Doritos bags, Gushers, Dunkaroos, Fun Dip, Squeeze-Its)
- VHS tape stack (horror movies, comedies, recorded-from-TV tapes with handwritten labels)
- Lava lamp / nightlight glow in dark room
- Sleeping bags in a row (each one a different character/color)
- Ouija board on the floor (candles around it, flashlight nearby)
- Walkie-talkies (still on, red light blinking)
- Magazine / yearbook (open on the floor, pen marks, doodles)
- Morning after (cereal bowls, cartoons on, sleeping bags abandoned)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1980-1995 era — no modern snacks, no smartphones, no streaming
- Late-night energy implied by mess and darkness + TV glow
- Gender-neutral — both boys and girls had sleepovers

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
