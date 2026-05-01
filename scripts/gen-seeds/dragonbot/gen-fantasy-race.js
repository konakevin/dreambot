#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_race.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} FANTASY RACE / LINEAGE entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (15-25 words) describing the EXACT visual signature of a specific fantasy race / lineage drawn from popular fantasy worlds — D&D / Forgotten Realms, LOTR / Tolkien, World of Warcraft, Elder Scrolls, Witcher, Critical Role, Pathfinder, Eberron.

Each entry locks: ear shape, eye type, skin/scale tone, distinguishing feature (horns / tusks / scales / fangs / etc.), and a 2-3 word vibe. The character will be rendered AS this lineage. Race is GENDER-NEUTRAL — the same race entry works for both male and female warriors.

━━━ COVERAGE TARGETS (enforce variety across ${n}) ━━━

ELVES (5-6, all visually distinct):
- High elf — sharply pointed ears, almond-shaped luminous eyes, otherworldly elegant features, cool alabaster or olive skin, regal bearing
- Wood elf — bronze sun-warmed skin, leaf-green eyes, sharp-pointed ears, wild forest-rugged features, tribal-painted face
- Drow / Forgotten Realms dark elf — obsidian-grey skin, white-silver platinum hair, glowing red or violet eyes, sharp angular features, Underdark-pale
- Dunmer / Elder Scrolls dark elf — ash-grey skin, blood-red eyes, sharply pointed ears, sharp eastern-volcanic features, ash-warrior bearing
- Blood elf — pale ivory skin, glowing emerald-green or fel-gold eyes, sharply tapered long ears, magic-fed elegant features
- Night elf — purple-tinted moon-pale skin, glowing silver or amber eyes, exceptionally long ears, druidic-tattooed face

DWARVES (3):
- Mountain dwarf — heavy-bearded with intricate braids, ruddy weather-beaten skin, deep-set steely eyes, broad powerful build, thick eyebrows
- Hill dwarf / LOTR dwarf — Tolkien-style with massive forked beard, leather-and-mail bearing, hawkish nose, fierce dark eyes
- Duergar / grey dwarf — ash-pale Underdark skin, no facial hair or thinner beard, glowing dim eyes, gaunt sun-deprived features

TIEFLINGS / FIENDISH (2-3):
- Tiefling — crimson or violet skin, curving ram or goat horns, slit-pupil eyes, prehensile tail visible at the hip, infernal-blooded sharp features
- Aasimar — celestial-pale or warm-bronzed skin, faintly glowing pale-gold eyes, heavenly-glowing skin patches, divine-blooded radiant features
- Genasi (fire) — copper-red or charcoal skin, embers visible at the temples, glowing flame-orange eyes, smoke wisping from hair

DRAGONBORN / SCALED (2):
- Dragonborn — reptilian scaled face replacing human skin, draconic snout where mouth would be, brass / silver / red / black scales catching the light, no nose, slit-pupil eyes, vestigial tail
- Yuan-ti / serpent-folk — human face with a faint scale-pattern across cheekbones, slit-pupil eyes, forked tongue visible, scaled forearms

ORC / ORCISH (3-4, all distinct):
- Half-orc / D&D — green-grey muted skin, pronounced lower tusks, heavy brow, broad jaw, scarred features, smaller-than-full-orc
- WoW orc / Horde — vivid green or brown skin, large lower tusks, heavy brow ridge, fierce battle-painted features, massive build
- LOTR uruk-hai — black-grey weather-beaten skin, jagged tusks, bone-painted face, fierce yellowed eyes, war-painted brow
- Witcher / Pathfinder orc — grey-green skin, sharp underbite tusks, scarified face, heavy iron piercings

GIANT-BLOOD / LARGE (2):
- Goliath — ash-grey skin with darker tribal-pattern markings, massive 7-foot frame, glowing pale eyes, mountain-clan tattoos
- Firbolg — pale blue-tinted skin with subtle bovine features, gentle wide-set eyes, delicate small tusks, fey-touched warm features

BEAST-FOLK (3-4):
- Tabaxi / Khajiit — fully feline-headed humanoid, fur-covered face with cat-features, slit-pupil eyes, pointed cat-ears, whiskers
- Tauren / minotaur — bovine-headed humanoid, massive curved horns, fur-covered face, glowing eyes, hooved
- Worgen — wolf-form humanoid, fur-covered angular face, fanged jaw, pointed wolf-ears, glowing yellow eyes
- Lizardfolk / Argonian — fully reptilian with scaled head, frill or horn-crest at the back of the skull, slit-pupil cold eyes, no hair

CONSTRUCTED / SPECIAL (2-3):
- Warforged — full mechanical-and-iron body, faintly glowing eye-slits, runic engravings on the chest-plate, no organic skin visible
- Shadar-kai — pale ash-grey skin, white-silver hair, hollow shadow-touched eyes, gaunt elongated features, plane-touched ethereal bearing
- Aasimar (radiant variant) — visible glowing skin patches, faint celestial wings as suggestion not flesh, divine markings

NUMENOREAN / ELITE HUMAN (2-3):
- Númenórean / Dúnedain — long-lived noble human, sharply chiseled features, grey or pale-blue eyes, raven-dark hair, tall regal bearing
- Witcher mutant — pale-gold cat-slit eyes, scarred-pale skin, white-or-platinum hair from mutagens, hardened mutant features
- Rohirrim warrior — sun-warmed Northern fair skin, blue-or-green eyes, golden-blond braided hair, weathered horse-clan features

━━━ RULES ━━━
- Each entry is a SHORT VISUAL SIGNATURE — anatomy, distinguishing feature, skin/eye/hair color, vibe
- 15-25 words — dense and specific
- GENDER-NEUTRAL — works for both male and female warriors
- Coverage MUST span all the franchise families above
- Each entry should be visually DISTINCT — a render with this entry should be unmistakable for any other entry
- Use specific franchise wording where iconic (Drow / Dunmer / blood elf / Dragonborn / Worgen / Tauren / Argonian / Khajiit / Warforged / Tiefling / Aasimar / Goliath / Firbolg / Númenórean / Rohirrim / Half-orc)
- No personality (warriors get personality from the archetype pool) — JUST the visual lineage signature
- One entry MUST be drow, one MUST be dragonborn, one MUST be tiefling — these are the iconic three
- Avoid mythical creatures that aren't humanoid warriors (no full dragons, no fey wisps, no centaurs that can't wear armor)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
