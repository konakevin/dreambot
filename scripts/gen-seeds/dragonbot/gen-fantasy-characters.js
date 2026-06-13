#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_characters.json',
  total: 200,
  batch: 50,
  banHumanLanguage: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} FANTASY CHARACTER descriptions for DragonBot — archetype characters by role only. LOTR/GoT/Harry-Potter/Witcher energy. Never named.

Each entry: 10-20 words. One specific archetype with distinguishing visual details.

⛔ BANNED LANGUAGE (it makes the model render a generic modern human):
• NO age words/numbers — no "young / old / elderly / ancient / middle-aged / X-year-old". Show seniority through grey beard, weathered skin, lined face.
• NO "man / woman / male / female / boy / girl / lady / person." Gender is carried ONLY by role-noun (sorceress / priestess / shield-maiden / huntress / warlock / warlord) and pronouns.
• For non-human races, name the race + a distinctive non-human feature (tusks / horns / pointed ears / scales / small stature) so it renders as the SPECIES, not a costumed human.

━━━ CATEGORIES ━━━
- Wizards (hooded wizard with staff and flowing robe, robed mage mid-gesture)
- Rangers (elf-archer in cloak with longbow, forest scout with dual blades)
- Knights (armored knight with heraldic surcoat, warrior in battle-worn plate)
- Mages (battle-mage in layered robes with crystal staff, apprentice with grimoire)
- Druids (antler-crowned druid in leaf-cloak, grey-bearded forest-warden with a bird)
- Paladins (gleaming-armor paladin with radiant hammer, righteous warrior in white plate)
- Hooded figures (rogue-assassin in shadow, traveling wanderer with lantern)
- Warlords (iron-crowned warlord on throne, brutal commander with standard)
- Elven archers (high-elf with silver-leaf armor, wood-elf in dappled green)
- Dwarven smiths (braided-beard dwarf at forge, stone-grey rune-master dwarf)
- Crone witches (hunched herbalist-witch with mortar, sharp-eyed hedge-witch)
- Woodsmen (bearded mountain-scout, cloaked path-finder)
- Sorceresses (robed sorceress with floating spell-book, arcane-tattooed enchantress)
- Hunters (monster-hunter with silver sword and crossbow, trophy-bearing warrior)
- Bards (lute-carrying wanderer in patchwork cloak)
- Priests / clerics (robed priestess with holy symbol, veiled shrine-keeper)
- Barbarians (furclad warrior with greatsword, war-painted berserker)
- Orcish warriors (tusked raider with crude axe, grey-green war-chief)
- Goblin shamans (hunched charm-bone shaman, hook-nosed goblin with staff)
- Dark wizards (robed necromancer with skull-staff, blood-magic warlock)
- Fae monarchs (crown-of-antlers fae queen, thorn-wreathed fae lord)
- Halflings (small curly-haired wanderer with pack, big-footed burrow-dweller with pipe)
- Elven nobles (crown-circlet elven prince, silver-haired elven courtier)
- Warrior-queens & shield-maidens (battle-scarred shield-maiden with axe, ranger-queen with bow)

━━━ RULES ━━━
- BY ROLE ONLY — no Gandalf/Aragorn/Daenerys/Geralt/Hermione/etc.
- Include specific visual details (clothing, weapon, accessory, stance)
- Full fantasy diversity (human, elf, dwarf, fae, goblin, orc, halfling) — render non-humans as the species
- Obey the BANNED-LANGUAGE block: zero age words, zero man/woman/lady

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
