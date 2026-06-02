#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/wow_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} WORLD-OF-WARCRAFT-CODED ARCHITECTURE entries for DragonBot's wow-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the WoW aesthetic tradition — Stormwind-style human throne hall, Orgrimmar-style orc war-keep, Ironforge-style dwarven underground forge, Darnassus-style night-elf tree-temple, Silvermoon-style blood-elf classical hall, Dalaran-style wizard-tower chamber, Acherus-style death knight gothic citadel, Naxxramas-style necromantic bone-chamber, Pandaria-style Asian-coded zen temple, Shadowlands-realm interiors (Bastion classical, Maldraxxus necromantic, Ardenweald fey-grove, Revendreth gothic).

CRITICAL — NO CHARACTERS, NO PEOPLE, NO HEROES-IN-FRAME. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Azeroth", "Stormwind", "Orgrimmar", "Ironforge", "Darnassus", "Silvermoon", "Pandaria", "Northrend", "Outland", "Argus", "Shadowlands", "Bastion", "Maldraxxus", "Ardenweald", "Revendreth", "Suramar", "Dalaran", "Acherus", "Naxxramas", "Naga", "Horde", "Alliance" — describe the AESTHETIC generically. Use phrases like "human-kingdom throne hall", "orc war-keep great hall", "dwarven underground forge", "night-elf tree-temple chamber", "blood-elf gold-and-red classical hall".

━━━ AESTHETIC DNA ━━━

Capture the mood of Blizzard WoW concept-art / Samwise Didier / Glenn Rane / Wei Wang / Peter Lee / hand-painted-stylized. Each faction/zone has a STRONG architectural language: HUMAN white-stone-and-gold classical-medieval, ORC red-iron-and-spike warrior-keep, DWARVEN underground stone-and-fire-and-runes, NIGHT-ELF lavender-and-purple sacred-tree, BLOOD-ELF gold-and-red ornate-classical, WIZARD-TOWER blue-and-violet magical-arcane, DEATH-KNIGHT gothic dark-spire, NECROPOLIS bone-and-fungus, PANDARIA jade-and-wood Asian-zen, SHADOWLANDS realm-distinct (gold-blue ascended, bone-decay, fey-fae translucent, gothic-crimson). Skies and lighting are theatrical.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

HUMAN-KINGDOM CLASSICAL-MEDIEVAL THRONE HALLS (~3):
- vast white-stone throne hall with vaulted gold-trimmed ceiling, banner-tapestries hanging, raised dais with elaborate carved throne
- human-kingdom audience chamber with arched windows, polished marble floor, gold-leaf-decorated columns, ornate mosaic
- castle great hall with stone walls and burning hearth, long oak feast tables (no figures), hanging banners, torchlight

ORC WAR-KEEP GREAT HALLS (~3):
- orc war-keep great hall with rough-hewn stone walls, banners with red sigils hanging, central iron-and-bone throne
- warrior-citadel chamber with weapon-racks lining the walls, central fire-pit, dim amber torchlight
- battle-keep interior with reinforced log-and-stone walls, scattered iron decorations, banners flying inside

DWARVEN UNDERGROUND FORGE-CHAMBERS (~3):
- vast underground forge-cathedral with central lava-vat glowing red, stone-carved columns, runes etched into the walls
- dwarven great hall with rune-stone walls, brazier-fires illuminating, ornate stone-carved arches
- underground throne chamber with chiseled-stone walls, gold-vein decoration, central anvil-throne

NIGHT-ELF TREE-TEMPLE CHAMBERS (~3):
- ancient nightelf-style temple grown into a massive tree, lavender-purple leaves above, shimmering moonwell at the center
- night-elf druidic chamber with bark-walls and root-formed columns, soft silver moonlight filtering through canopy
- tree-canopy sanctuary with curved wooden architecture, glowing crescent-moon symbols, atmospheric mist

BLOOD-ELF / NIGHTBORNE CLASSICAL HALLS (~3):
- blood-elf gold-and-red classical hall with elaborate columns, ornate floor mosaic, soft amber-magical ambient
- nightborne shimmer-architecture interior with translucent walls, cascading light-magic, classical proportions
- elven palace audience chamber with gold-leaf decoration, crimson tapestries, intricate floor pattern

WIZARD-TOWER ARCANE CHAMBERS (~3):
- floating wizard-tower interior with rotating glyph-circles in the air, books levitating, deep blue-and-violet ambient
- arcane chamber with crystal sphere suspended at center, walls lined with grimoires, soft magical glow
- wizard-tower observatory with telescope rising through glass dome, star-charts on the walls, dim purple ambient

GOTHIC DEATH-KNIGHT / NECROPOLIS INTERIORS (~3):
- death-knight citadel chamber with black gothic spires inside, frozen-blue ambient, central rune-altar
- necropolis bone-chamber with skull-decorated walls, glowing-green necromantic conduits, dim sickly-green light
- gothic dark-spire interior with bone-architecture, crimson runic-glow, dread-laden atmospheric mood

PANDARIA-STYLE ZEN TEMPLE INTERIORS (~3):
- ancient Asian-coded mountain temple with pagoda interior, jade-stone walls, paper lanterns hanging, soft gold ambient
- zen meditation chamber with bamboo-screen walls, single shaft of light, low cushion at center, atmospheric mist
- mountain monastery hall with elegant wooden architecture, jade-stone floor, distant pagoda visible through arched window

SHADOWLANDS-REALM INTERIORS (~2):
- ascended sky-realm hall with gold-and-blue celestial-classical architecture, soft glowing-celestial ambient, ornate fluted columns
- fey-fae grove-temple with translucent crystalline architecture, glowing flora, soft violet-pink ambient

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO orcs / NO elves / NO heroes-as-figures
- NO franchise proper nouns
- HAND-PAINTED-STYLIZED material specificity (white-stone-and-gold human / red-iron orc / rune-stone dwarven / lavender-bark night-elf / gold-and-red blood-elf / blue-violet wizard / gothic-bone-green necropolis / jade-and-wood Pandaria / celestial-gold or fey-translucent shadowlands)
- Variety across the 9 categories above mandatory
- Cinematic / fantasy-epic scale, theatrical lighting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
