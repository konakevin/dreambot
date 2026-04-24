#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/holiday_seasons.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} HOLIDAY SEASON scene descriptions for RetroBot — the magic of holidays as a kid, 1975-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific holiday scene or detail.

━━━ CATEGORIES ━━━
- Christmas morning (wrapping paper chaos, tree with big bulb lights, tinsel everywhere)
- Christmas tree closeup (bubble lights, glass ornaments, tinsel strands, star on top)
- Sears/JCPenney catalog (dog-eared toy pages, circled items, pen marks)
- Under the tree (unwrapped gifts, ribbon curls, instruction manuals scattered)
- Stockings on the fireplace (overstuffed, candy canes poking out)
- Halloween porch (carved pumpkin with candle, fake cobwebs, orange lights)
- Halloween candy spread (pillowcase dumped on floor, sorting the haul)
- Trick-or-treat bucket (plastic pumpkin, full of candy bars and Smarties)
- 4th of July (sparklers in a jar, red-white-blue paper plates, watermelon rinds)
- Fireworks from the lawn (blanket on grass, empty lawn chairs, sparkler trails)
- Easter basket (plastic grass, chocolate bunny, dyed eggs, jelly beans)
- Thanksgiving table (orange candles, construction-paper turkey craft, casserole dishes)
- Valentine's Day classroom (shoebox mailbox, cartoon valentines, candy hearts)
- Birthday party (cone hats, streamers, sheet cake with candles, party favor bags)
- Snow day (sled on the porch, wet boots by the door, cocoa mug on counter)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 era — no modern decorations, no LED lights, no Amazon boxes
- The holiday is identified by objects and atmosphere, not by text/signs
- Gender-neutral — every kid lived these holidays

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
