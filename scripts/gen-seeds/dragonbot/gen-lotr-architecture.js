#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/lotr_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LORD-OF-THE-RINGS-CODED ARCHITECTURE entries for DragonBot's lotr-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the Tolkien / Middle-earth aesthetic tradition — Shire-coded round-doored hobbit-hole interiors, Mordor black-tower throne chambers, Rivendell elven-waterfall-hall interiors, Moria dwarven stone-pillar halls, Edoras golden mead-hall interiors, Minas Tirith white-stone throne chambers, Erebor dwarven gold-treasury, Saruman tower interiors.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO HOBBITS, NO ELVES, NO HEROES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Middle-earth", "Shire", "Mordor", "Rivendell", "Lothlórien", "Moria", "Edoras", "Rohan", "Gondor", "Minas Tirith", "Helm's Deep", "Fangorn", "Erebor", "Khazad-dûm", "Saruman", "Sauron", "Frodo", "Gandalf", "Aragorn", "Bag End", "Orthanc", "Barad-dûr" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of Peter-Jackson / Alan-Lee / John-Howe / Ted-Nasmith painted concept-art tradition. Each interior has a STRONG faction architectural language: HOBBIT cozy round-doored earth-built warm-wood, MORDOR brutal black-iron-and-spike tower-chamber, ELVEN graceful slim-and-curving white-and-blue waterfall-hall, DWARVEN massive stone-pillar carved-rune halls, ROHAN warm-wood golden-thatched mead-hall, GONDOR white-stone carved-throne classical, EREBOR-TREASURY mountains-of-gold-coin treasure-vault, ISENGARD black-tower industrial wheel-and-forge.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

HOBBIT-HOLE COZY INTERIORS (~3):
- cozy round-doored earth-built hobbit-hole interior with warm wood paneling, circular windows, hanging-pots, embers in stone fireplace
- earth-built hobbit-style cottage interior with low ceiling, wooden beams, scattered books on tables, oil-lamp glow
- circular-doored hobbit-style hallway with warm wood walls, framed family portraits, oil-lamp warmth, scattered shoes by the door

MORDOR BLACK-TOWER THRONE CHAMBERS (~3):
- vast black-tower throne chamber with brutalist black-iron and obsidian walls, single elevated throne, blood-red ambient
- dark-lord throne hall with massive iron-pillar architecture, glowing red brazier-fires, oppressive dread-laden atmosphere
- iron-fortress chamber with spike-decorated walls, lava cracks running through the floor, single dark throne on raised dais

ELVEN WATERFALL-HALL INTERIORS (~4):
- elven-king throne hall with curving white-and-blue architecture, cascading waterfall behind the throne, soft silver light
- elven sanctuary hall with slim graceful columns, autumn-gold leaf inlay on the floor, atmospheric mist, soft amber ambient
- crystalline elven library with curving balconies, ancient scroll-codices, soft moonlight through arched windows
- elven feast hall with long curving tables, candle-light, slim white columns, banners with elven sigils hanging

DWARVEN STONE-PILLAR HALLS (~4):
- vast dwarven underground hall with massive carved-stone pillars receding into darkness, ancient runes glowing faintly
- dwarven throne chamber with stone-throne carved into a mountain wall, massive stone-pillars, brazier-fires
- mountain-king's hall with massive carved-stone columns, ancient gold-vein decoration, single shaft of skylight
- underground stone-bridge spanning a chasm with no railings, abyss below, dim torchlight on either end

ROHAN GOLDEN MEAD-HALL (~2):
- horse-clan mead-hall with golden-thatched roof inside, long oak feast tables, banners flying, central hearth-fire
- warm-wood timber-hall with carved horse-head pillars, banners with horse-sigils, central long-fire, dim amber torchlight

GONDOR WHITE-STONE THRONE CHAMBERS (~3):
- vast white-stone throne hall with carved-stone columns, single white-tree fountain at center, golden throne empty on dais
- ascending white-stone stairway with carved-pillar architecture, banners flying, tower-window framing distant mountain
- citadel court with white-tree centerpiece, polished stone floor, banners hanging from impossibly high ceiling

DWARVEN GOLD-TREASURY (~2):
- vast underground treasure-vault with mountains of gold coins glittering, gold-and-jewel mounds, single shaft of light
- dragon-treasure chamber with gold piled chest-high, scattered jewel-cups, ancient stone pillars carved with runes

ISENGARD BLACK-TOWER INTERIORS (~2):
- black-tower wizard's chamber with massive obsidian walls, central palantír-stand, scattered scrolls, dim ambient
- industrial wheel-and-forge tower-interior with massive gears and chains, anvil-stations, bellows-fires, dark mood

DARK-WIZARD STUDIES (~2):
- ancient wizard's tower study with arched windows, books levitating, scattered alchemical apparatus, deep blue-violet ambient
- arcane chamber with crystal-orb on a stone pedestal, walls lined with grimoires, soft magical glow

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO hobbits / NO elves / NO heroes
- NO franchise proper nouns
- PETER-JACKSON / ALAN-LEE / JOHN-HOWE painted-matte mood — EPIC, ANCIENT, BIBLICAL
- Variety across the 9 categories above mandatory
- Strong material specificity per faction (cozy-warm-wood Hobbit / black-iron-spike Mordor / white-and-blue elven / massive stone-pillar dwarven / golden-thatched-wood Rohan / white-stone-classical Gondor)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
