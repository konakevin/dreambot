#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_race.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} FANTASY RACE / LINEAGE entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (15-25 words) describing the EXACT visual signature of a HUMAN-SHAPED fantasy lineage drawn from popular fantasy worlds — D&D / Forgotten Realms, LOTR / Tolkien, World of Warcraft, Elder Scrolls, Witcher, Pathfinder.

CRITICAL — ALL ENTRIES MUST BE HUMAN-SHAPED. NO scaled reptilians (no dragonborn, no yuan-ti, no argonian / lizardfolk). NO beast-headed creatures (no tabaxi, no worgen, no tauren). NO fully-mechanical (no warforged). NO non-humanoid creatures. Every race in this pool walks upright on two legs with a recognizably HUMAN-SHAPED body, head, and face — even if they have horns, tusks, pointed ears, ash-grey skin, glowing eyes, or other humanoid-but-distinct features.

Each entry locks: ear shape, eye type, skin tone, distinguishing humanoid feature (horns / tusks / divine markings / etc.), and bearing. The character will be rendered AS this lineage. Race is GENDER-NEUTRAL — same race entry works for both male and female warriors.

━━━ COVERAGE TARGETS (enforce variety across ${n}) ━━━

ELVES (10, all visually distinct):
- High elf (D&D Aelvar / Tolkien Noldor) — sharply pointed ears, almond-shaped luminous gold eyes, alabaster skin, regal aristocratic features
- Wood elf (D&D / Tolkien Silvan) — bronze sun-warmed skin, leaf-green eyes, sharp pointed ears, tribal face-paint, wild forest-hardened features
- Drow (Forgotten Realms dark elf) — obsidian-grey skin, white-silver platinum hair, glowing red or violet eyes, sharp angular Underdark features
- Surface drow / renegade — same drow features but skin slightly faded from sun exposure, eyes still glowing, carrying surface-world weariness
- Dunmer (Elder Scrolls Morrowind dark elf) — ash-grey skin, blood-red eyes, sharply pointed ears, sharp eastern-volcanic features, ash-warrior bearing
- Blood elf (WoW Sin'dorei) — pale ivory skin, glowing fel-green eyes, sharply tapered long ears, magic-fed elegant gaunt features
- Night elf (WoW Kaldorei) — purple-tinted moon-pale skin, glowing silver eyes, exceptionally long ears, druidic facial tattoos
- Bosmer wood elf (Elder Scrolls) — olive-tan forest skin, hazel eyes, less-pointed-than-D&D ears, tribal beadwork in hair
- Eladrin (D&D twilight elf) — fey-shifted skin tone (changes with seasons), opalescent eyes, longer ears than high elf, fey-courtier bearing
- Sea elf (D&D aquatic) — pale blue-tinged skin, deep ocean-blue eyes, faint webbing between fingers, gill-marks at the throat (subtle), pointed ears

HUMANS (8, cultural diversity):
- Númenórean / Dúnedain — long-lived noble human, sharply chiseled features, grey-blue eyes, raven-dark hair, tall regal bearing
- Rohirrim warrior — sun-warmed Northern fair skin, blue-or-green eyes, golden-blond braided hair, weathered horse-clan features
- Gondorian — Mediterranean-olive skin, dark eyes, dark hair, hawkish noble features, austere southern bearing
- Witcher mutant — pale-gold cat-slit eyes, scarred-pale skin, white-or-platinum hair from mutagens, hardened mutant features
- Imperial (Elder Scrolls Cyrodiilic) — warm olive skin, brown eyes, dark wavy hair, soldierly aristocratic bearing
- Nord (Elder Scrolls) — fair Northern skin, blue eyes, blond braided beard or hair, weathered Skyrim features
- Redguard (Elder Scrolls) — deep umber dark skin, dark almond eyes, close-cropped or twist-braided hair, desert-warrior bearing
- Breton (Elder Scrolls) — ivory-fair skin with magical undertone, hazel-or-green eyes, auburn hair, slight magical-glow at the temples

HALF-RACES (3):
- Half-elf — pointed-but-shorter ears than full elf, almond-shaped eyes, even-toned skin, mixed-heritage features
- Half-orc — muted green-grey skin, pronounced lower tusks, heavy brow, broad scarred jaw, smaller-than-full-orc
- Half-drow — light grey skin lighter than drow, white-silver hair from drow heritage, normal-pupil but pale eyes, surface-dwelling bearing

DWARVES (4):
- Mountain dwarf — heavily-braided beard, ruddy weather-beaten skin, deep-set steely eyes, broad powerful build
- Hill dwarf / LOTR Tolkien-style — massive forked beard with iron rings, leather-tanned skin, fierce dark eyes, Tolkien battle-hardened build
- Duergar grey dwarf — ash-pale Underdark skin, thin-or-no beard, dim glowing eyes, gaunt sun-deprived features
- Mahakaman dwarf (Witcher) — coarse-tan weathered skin, thick beard with worked-iron clasps, dark fierce eyes, gruff industrious bearing

ORCS (3):
- WoW Horde orc — vivid green skin, large lower tusks, heavy brow ridge, fierce battle-painted features, massive build
- LOTR uruk-hai — black-grey weather-beaten skin, jagged tusks, bone-painted face, fierce yellowed eyes, war-painted brow
- Witcher orc — grey-green skin, sharp underbite tusks, scarified face, heavy iron piercings

TROLLS (2, WoW HUMANOID variety only — no LOTR/D&D monster trolls):
- WoW Darkspear troll — tall lanky tusked humanoid, blue-grey skin, jutting tusks, glowing red-amber eyes, voodoo-painted features
- WoW Zandalari troll — tall regal gold-gleaming bronze skin, larger tusks than Darkspear, gold-and-feather adornments, pharaonic bearing

HALFLINGS (2):
- Lightfoot halfling — slightly tan freckled skin, hazel-or-brown eyes, curly brown-or-auburn hair, hairy bare feet, peaceful pastoral features
- Stout halfling / Hobbit — fair pinkish skin, blue-or-green eyes, bushy curly hair, hairy bare feet, well-fed cheery features

GNOMES (2):
- Forest gnome — sun-warmed bronze skin, bright wide-set blue-or-green eyes, wild colorful hair, small pointed ears, mischievous fey features
- Rock gnome — paler skin, sharp curious eyes, neatly-styled hair, small rounded ears, tinker-bench scholarly features

GOLIATH (1):
- Goliath — ash-grey skin with darker tribal-pattern markings, massive seven-foot frame, glowing pale eyes, mountain-clan tattoos, stone-textured shoulders

TIEFLINGS (3, all human-shaped with horns/tail):
- Asmodeus-lineage tiefling — crimson skin, curving ram horns, slit-pupil red eyes, prehensile tail, infernal-blooded sharp features
- Mephistopheles-lineage tiefling — pale grey-blue skin, straight black-iron horns, glowing white-blue eyes, prehensile tail, scholarly cold infernal features
- Zariel-lineage tiefling — bronze warlike skin, jagged short black horns, glowing gold eyes, war-bred predatory features, prehensile tail

AASIMAR (2, human-shaped with divine markings):
- Protector aasimar — celestial-pale skin, faint glowing eyes, divine-radiant skin patches, golden-light at the temples, healer-warrior bearing
- Scourge aasimar — warm-bronzed skin with tribal divine-markings, glowing fierce gold eyes, war-light radiating, vengeance-blessed bearing

━━━ RULES ━━━
- EVERY entry must be HUMAN-SHAPED — humanoid body, humanoid head, humanoid face. No animal heads, no fully-scaled faces, no mechanical bodies.
- Tieflings have HUMAN faces with HORNS — not scaled snouts. Aasimar have HUMAN faces with subtle glow markings.
- Each entry is a SHORT VISUAL SIGNATURE — anatomy, distinguishing feature, skin/eye/hair color, vibe
- 15-25 words — dense and specific
- GENDER-NEUTRAL — works for both male and female warriors
- Coverage MUST span all the franchise families above
- Each entry should be visually DISTINCT
- Use specific franchise wording where iconic (Drow / Dunmer / blood elf / Worgen / Tauren / Argonian / Khajiit don't appear in this pool — those are intentionally REMOVED for being non-human-shaped or beast-headed)
- No personality (warriors get personality from the archetype pool) — JUST the visual lineage signature
- ABSOLUTELY NO: dragonborn, yuan-ti, argonian, lizardfolk, tabaxi, khajiit, worgen, tauren, warforged, ratfolk, kenku, aarakocra, centaur, satyr, firbolg, triton, genasi, shadar-kai with non-human aspect, or any other non-human-shape race

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
