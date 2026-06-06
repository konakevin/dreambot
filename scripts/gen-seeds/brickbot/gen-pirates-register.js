#!/usr/bin/env node
/**
 * BRICKBOT_PIRATES_REGISTER — pirate era / faction heritage lock.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_pirates_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's pirates path — a register is a pirate era / faction / regional heritage. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC pirate heritage (Golden-Age Caribbean, Norse Raid, Barbary Corsair, Spanish Conquistador, Naval Imperialist, Mediterranean Galley, etc.) and locks: KIT (hats / weapons / clothing details) + SHIP-CLASS hint + SCENE-ANCHOR. Sonnet must produce visibly distinct heritages.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 GOLDEN-AGE CARIBBEAN: standard / Blackbeard / Calico Jack / Mary Read / Anne Bonny
- ~3 ROYAL NAVY / IMPERIALIST: British man-of-war, Spanish galleon, French frigate, Dutch flute
- ~3 NORSE / VIKING: longship raid, drekar, knarr trader, raid party
- ~3 BARBARY / CORSAIR: Mediterranean galley, oared chase, dhow
- ~3 GREEK / PHOENICIAN: trireme, bireme, ancient pirate-king
- ~3 CHINESE / EASTERN: junk-rigged pirate-king, Ching Shih fleet, sampan raid
- ~3 POLYNESIAN: outrigger canoe, double-hulled, war canoe
- ~3 PORT-CITY: Tortuga tavern, Port Royal market, Cartagena dock
- ~3 GHOST / CURSED: undead pirate, Davy Jones-coded crew, ghost-galleon
- ~3 FANTASY-PIRATE: dragon-companion captain, witch-doctor pirate, krak-en hunter
- ~2 PRIVATEER / LEGAL-CORSAIR: licensed privateer, letter-of-marque captain
- ~2 SPANISH MAIN GOLD-HUNTER
- ~2 ARCTIC / NORDIC SEA-RAIDER: hunting party in frozen seas

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention KIT + SHIP-CLASS + SCENE-ANCHOR. Touchpoints:
"GOLDEN-AGE CARIBBEAN STANDARD — tricorn hats, leather cross-belts, silk sashes in crimson or gold, cutlasses + flintlock pistols, Jolly Roger flag, 1650-1730 era galleon as ship-class anchor"
"NORSE RAID STANDARD — horned helmets (not antlered), chain-mail tunics, round wood-and-iron shields, two-handed axes, runic banner on mast; ship_class becomes Norse-longship dragon-prow"
"BARBARY CORSAIR — turbans + flowing robes + curved scimitars + crescent-moon banner, oar-driven Mediterranean galley with iron-bound prow, Tunisian port-call setting"

━━━ BANS ━━━
- NO licensed franchise names verbatim (no Sparrow / Hook / Black Pearl)
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
