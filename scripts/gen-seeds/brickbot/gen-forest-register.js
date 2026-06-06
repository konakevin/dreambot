#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_REGISTER — forest faction / heritage lock.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's forest path — a register is a forest/woodland HERITAGE FACTION that defines look (palette + minifig kit + structural element). Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a fantasy/realistic woodland faction (Forestmen, Elvendale fae, Druid circle, fairy-tale cottager, ranger camp, etc.) and locks PALETTE + MINIFIG KIT + SCENE ANCHOR. Sonnet must produce visibly distinct registers — not interchangeable "forest" beats.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO FACTIONS: Forestmen, Elvendale, Friends-Forest, Adventurers-Jungle, Creator-Tree
- ~3 FAE / FAIRY: fae-court, pixie-realm, wood-nymph, moss-fae
- ~3 DRUID / NATURE-MAGIC: druid-circle, witch coven, moon-priestess, totem-shaman, antler-shaman
- ~3 OUTLAW / RANGER: Robin-Hood band, ranger camp, smuggler hideout, sherwood outlaws
- ~3 FAIRY-TALE: Hansel-Gretel gingerbread, Snow-White cottage, Red-Riding-Hood path, three-bears
- ~3 NORDIC / VIKING-FOREST: Norse settlement, longhouse, runestone clearing
- ~3 JUNGLE-EXPLORER / SAFARI: pith-helmet adventurer, jungle outpost, ruins explorer
- ~3 INDIGENOUS / TRIBAL (generic-coded): jungle village, totem-circle, mask-wearer council, tree-platform settlement
- ~2 TREEHOUSE / SETTLER: brick-builder cabin, woodcutter homestead, frontier ranch
- ~2 CRYPTID / DARK-FOREST: bigfoot research, haunted-woods cabin, witch's hut, blair-witch
- ~1 CAMP / SCOUTS — modern camping outpost
- ~1 LUMBERJACK / TIMBER-COMPANY operation

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + MINIFIG KIT + SCENE ANCHOR. Touchpoints:
"ELVENDALE FAIRY-COURT SIGNATURE — teal + lavender + gold + rose palette, fairy/elf minifigs with translucent-wing elements + flower-crown hair-pieces + layered silk-tunic prints, treetop palace with crystal-orb finials"
"FORESTMEN WOODLAND-RANGER SIGNATURE — forest-green + brown + tan palette, green-hood ranger minifigs with quivers + feathered caps + leaf-emblem tunic prints, rope-bridge between massive brick oak trunks"
"HANSEL-AND-GRETEL GINGERBREAD COTTAGE — pastel-brown + pink + cream palette, peasant-cottage minifig in dirndl and lederhosen + apple-basket accessory, candy-roof cottage with gumdrop-jewel walls"

━━━ BANS ━━━
- NO duplicating registers already in pool
- NO photoreal vocab
- NO licensed franchise IP verbatim
- NO blank "forest"; name the heritage

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
