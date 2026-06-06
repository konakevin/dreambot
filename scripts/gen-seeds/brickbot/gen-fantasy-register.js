#!/usr/bin/env node
/**
 * BRICKBOT_FANTASY_REGISTER — fantasy faction / order / heritage lock.
 * Audit 2026-06-05: 48 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_fantasy_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's fantasy path — a register is a fantasy FACTION / ORDER / HERITAGE that defines look (palette + minifig kit + heraldry + structural detail). Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a specific fantasy heritage (Crown Knights, Dragon Knights, Forestmen, Black-Falcon, Elven, Dwarven, Orc Hordes, etc.) and locks PALETTE + MINIFIG KIT (torsos/helms/weapons/shields) + SCENE ANCHOR (one structural element unique to the faction). Sonnet must produce visibly DISTINCT registers — not interchangeable "knight" beats.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~6 CASTLE FACTIONS: Crown Knights (lion-crest), Black Falcons, Forestmen (Robin Hood), Wolfpack, Crusaders / Crusader red-cross, Dragon Knights, Royal-Knights
- ~4 EVIL / DARK: Skeleton Lord, Necromancer's coven, Black Knight, Death-Knight order, Cult of the Dragon
- ~4 ELVEN: High-Elf court, Wood-Elf rangers, Dark-Elf, Sea-Elf, Sun-Elf, Moon-Elf
- ~4 DWARVEN: Mountain Dwarves, Hill Dwarves, Iron-Mountain forge-clan, Deep Dwarves, Dwarven engineers
- ~3 BARBARIAN / RAIDER: Viking Norse raiders, Conan-coded barbarian tribe, Hunnish horde, Steppe nomads
- ~3 ORC / GREENSKIN: orc horde, goblin warband, hobgoblin legion, ogre clan, troll war-band
- ~3 EASTERN / SAMURAI: Edo-period samurai, Mongol horde, Imperial-China court, Heian aristocrat
- ~2 RELIGIOUS / HOLY: Paladin order, Temple guards, Pilgrimage of the Holy-Order, Crusader templar
- ~2 ARABIAN / MOORISH: Arabian Nights court, Caliphate calvary, Desert Kingdom palace guards
- ~2 ANCIENT / CLASSICAL: Greek phalanx hoplite, Roman legion, Egyptian palace
- ~2 MYSTICAL ORDER: Wizards of the Tower, Druid circle, Witch coven, Mystics of the Moon
- ~1 CIRCUS / TROUBADOUR — wandering troupe in fantasy garb
- ~1 PIRATE-COVE coastal-castle variant

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + MINIFIG KIT + SCENE ANCHOR. Touchpoints:
"RED-CROSS WHITE-TABARD CHIVALRIC ORDER — knights in white surcoats over chain-mail with bold red-cross emblem on chest and round shields, gold-trim nasal-guard helmets, light-grey stone keep with red banners"
"DWARVEN MOUNTAIN-FORGE — bearded dwarven minifigs in dark-bley plate-armor + horned forge-helms, dual-axe + warhammer kit, dark-grey + iron-orange palette, mountain-forge interior with glowing trans-orange forge-pits"
"WOOD-ELF RANGER ORDER — slender elf-minifigs in dark-green hooded cloaks + leaf-pattern tunics, longbow + dagger + woven-grass quiver, dark-green + sand-tan palette, treetop tree-house outpost with rope-bridge"

━━━ BANS ━━━
- NO duplicating heritage already in pool
- NO photoreal vocab
- NO licensed franchise names verbatim (no Aragorn / Hogwarts / Westeros)
- NO blank "knight" or "warrior" — name the faction

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
