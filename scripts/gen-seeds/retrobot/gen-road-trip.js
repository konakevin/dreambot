#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/road_trip.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} ROAD TRIP scene descriptions for RetroBot — family car trips across America, 1975-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific road trip scene or detail.

━━━ CATEGORIES ━━━
- Car interior (vinyl backseat, cassette tapes scattered, road atlas unfolded)
- Station wagon rear (way-back seat facing backward, luggage, sleeping bags)
- Highway at sunset (two-lane road, power lines, grain silos on horizon)
- Motel exterior (vacancy sign buzzing, ice machine, room key on plastic tag)
- Motel pool at dusk (chain-link fence, concrete deck, diving board, blue glow)
- Gas station (full-service pump, squeegee bucket, road map rack, pay phone)
- Rest stop picnic table (fast food bags, thermos, state map, bug screen)
- Roadside attraction sign (neon arrow, "World's Largest" something, hand-painted)
- Drive-through window (paper bags, wrapped burgers, cardboard drink tray)
- Backseat floor (coloring books, crayons, Happy Meal toys, juice boxes)
- Dashboard (AM/FM radio dial, air freshener tree, compass ball, toll tickets)
- Campground at night (tent setup, lantern glow, cooler, folding chairs)
- Souvenir shop (snow globes, postcards, keychains, bumper stickers, pennants)
- Truck stop diner counter (pie case, coffee mugs, chrome stools, jukebox)
- Car trunk packed for departure (suitcases, cooler, beach chairs, bungee cords)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 era — no GPS, no smartphones, no modern cars
- The open-road feeling of being somewhere between home and adventure
- Gender-neutral — every family did this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
