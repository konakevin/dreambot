#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} FANTASY CHARACTER descriptions for DragonBot — archetype characters by role only. LOTR/GoT/Harry-Potter/Witcher energy. Never named.

Each entry: 10-20 words. One specific archetype with distinguishing visual details.

━━━ CATEGORIES ━━━
- Wizards (hooded wizard with staff and flowing robe, young mage mid-gesture)
- Rangers (elf-archer in cloak with longbow, forest scout with dual blades)
- Knights (armored knight with heraldic surcoat, warrior in battle-worn plate)
- Mages (battle-mage in layered robes with crystal staff, apprentice with grimoire)
- Druids (antler-crowned druid in leaf-cloak, old forest-warden with bird)
- Paladins (gleaming-armor paladin with radiant hammer, righteous warrior in white plate)
- Hooded figures (rogue-assassin in shadow, traveling wanderer with lantern)
- Warlords (iron-crowned warlord on throne, brutal commander with standard)
- Elven archers (high-elf with silver-leaf armor, wood-elf in dappled green)
- Dwarven smiths (braided-beard dwarf at forge, ancient rune-master dwarf)
- Crone witches (hunched herbalist-witch with mortar, sharp-eyed hedge-witch)
- Rangers / woodsmen (bearded mountain-scout, cloaked path-finder)
- Sorceresses (robed sorceress with floating spell-book, arcane-tattooed mage)
- Hunters (monster-hunter with silver sword and crossbow, trophy-bearing warrior)
- Bards (lute-carrying wanderer in patchwork cloak)
- Priests / clerics (robed priestess with holy symbol, veiled shrine-keeper)
- Barbarians (furclad warrior with greatsword, war-painted berserker)
- Orcish warriors (tusked raider with crude axe)
- Goblin shamans (hunched figure with charm-bones, elder goblin with staff)
- Dark wizards (robed necromancer with skull-staff, blood-magic warlock)
- Fae monarchs (crown-of-antlers fae queen, thorn-wreathed fae lord)
- Halflings (small hobbit-style wanderer with pack, burrow-dweller with pipe)
- Elves noble (crown-circlet elven prince, silver-haired elven lady-of-court)
- Warrior women (battle-scarred shield-maiden with axe, ranger-queen with bow)

━━━ RULES ━━━
- BY ROLE ONLY — no Gandalf/Aragorn/Daenerys/Geralt/Hermione/etc.
- Include specific visual details (clothing, weapon, accessory, stance)
- Full fantasy diversity (human, elf, dwarf, fae, goblin, orc, halfling)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
