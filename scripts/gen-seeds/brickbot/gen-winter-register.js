#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_REGISTER — winter heritage / faction lock.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's winter path — a register is a winter heritage / LEGO theme / scene-archetype. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC winter heritage (Winter-Village market, City-Arctic research-station, Friends-Snow-resort, etc.) and locks PALETTE + MINIFIG KIT + SCENE-ANCHOR.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO WINTER-VILLAGE: Holiday market, Toy-shop, Bakery, Train-station, Christmas-tree square
- ~4 LEGO CITY-ARCTIC: Research station, Arctic-supply transport, Snow-cat rescue, Polar-explorer base
- ~3 FRIENDS-SNOW: Heartlake ski resort, Snow boarding, Ice-skating party
- ~3 ALPINE-RESORT: Chalet luxury, ski-lift hub, lodge gathering
- ~3 NORDIC / VIKING-WINTER: longhouse hearth, viking-raid in winter, runestone
- ~3 INUIT / ARCTIC-INDIGENOUS (generic-coded): igloo village, kayak hunters, dog-sled team
- ~3 SANTA / NORTH-POLE: workshop, sleigh-launch, reindeer-stable
- ~3 SKI-RESORT MODERN: ski-jumper aerial, half-pipe, chair-lift
- ~3 ICE-FISHING / HOCKEY: ice-fishing shanty, hockey-rink game, pond skaters
- ~3 CHRISTMAS-EVE FAMILY: cozy cabin, fireplace stocking, gift-open
- ~3 SNOWMAN-LAND: snowman family, snowman parade, snowman castle
- ~2 ICE-CARNIVAL: ice-sculpture contest, frozen-canal skating
- ~2 PENGUIN / ANTARCTIC EXPEDITION
- ~2 ICE-HOTEL TOURISM: trans-blue brick ice-hotel suites
- ~1 SLEIGH-RACE: dog-sled race start
- ~1 WINTER-OLYMPICS: brick-built sport venue

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + MINIFIG KIT + SCENE-ANCHOR. Touchpoints:
"WINTER-VILLAGE MARKET SIGNATURE — red + green + white + gold palette, knit-cap-and-scarf villager minifigs, a cobblestone market square with timber stall-fronts + christmas-tree center-piece"
"CITY-ARCTIC RESEARCH-STATION SIGNATURE — orange + white + tech-grey palette, parka-and-goggle explorer minifigs with ice-core drill gear, a modular base-camp with snowmobile + ice-shelter dome"
"NORDIC LONGHOUSE WINTER SIGNATURE — dark-bley + dark-red + dark-tan palette, fur-cloaked Viking minifigs with axes + drinking-horns, a timber longhouse with snow-laden thatch roof"

━━━ BANS ━━━
- NO licensed franchise names verbatim
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
