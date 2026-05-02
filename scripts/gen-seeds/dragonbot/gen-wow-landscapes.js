#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/wow_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} WORLD-OF-WARCRAFT-CODED LANDSCAPE entries for DragonBot's wow-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC FANTASY VISTA in the WoW aesthetic tradition — Eastern-Kingdoms rolling hills with distant castles, Kalimdor purple-mist elf-forests, Outland shattered alien-colored hellscapes, Northrend icy fjord-wastes, Pandaria misty Asian-coded mountains, Shadowlands realm-vistas (gold-blue ascended Bastion, necromantic Maldraxxus, fey-fae Ardenweald, gothic Revendreth), demonic-fel Argus hellscapes, troll desert ruins, underwater naga cities.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO ORCS-AS-FOREGROUND, NO HEROES-IN-FRAME. Pure landscape only (distant beast silhouettes at scale OK).

CRITICAL — NO PROPER NOUNS. Never write "Azeroth", "Stormwind", "Orgrimmar", "Ironforge", "Darnassus", "Silvermoon", "Pandaria", "Northrend", "Outland", "Argus", "Shadowlands", "Bastion", "Maldraxxus", "Ardenweald", "Revendreth", "Suramar", "Dalaran", "Boralus", "Drustvar", "Zandalar", "Nazjatar", "Highmountain", "Horde", "Alliance", "Sylvanas", "Thrall", "Jaina", "Arthas" — describe the AESTHETIC generically. Use phrases like "rolling green hills with distant white-stone castle", "shattered alien-colored hellscape with floating rock fragments", "necromantic bone-and-fungus underworld", "fey-fae translucent forest realm".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Blizzard WoW concept-art / Samwise Didier / Glenn Rane / Wei Wang / Peter Lee / hand-painted-stylized fantasy. EVERY entry feels OVERSATURATED, hand-painted, larger-than-life. Color palettes are bold and faction/zone-coded. The world feels MAGICAL, ANCIENT, and OPERATIC. Skies are dramatic. Vegetation is heightened. Architecture peeks through landscape. Lighting is cinematic and theatrical.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

CLASSIC HUMAN/DWARF KINGDOM COUNTRYSIDE (~3):
- rolling green hills with distant white-stone castle on a bluff, golden afternoon light, banners flying, scattered farms
- mountain pass with stone-built fortress nestled between cliffs, snow drifting, distant griffin-rider silhouettes (no figures up close)
- fertile plains with classical-medieval village in the distance, river winding, dramatic painted-cloud sky

PURPLE-MIST NIGHT-ELF FORESTS (~3):
- ancient nightelf-style forest with massive lavender-leafed trees, mist drifting between trunks, glowing moonwell pool below
- moonlit glade with kaleidoscopic purple bioluminescence, towering ancient trees, a single shaft of silver light
- enchanted forest at twilight with shimmering motes of magic in the air, glowing flowers carpeting the ground

ALIEN-COLORED OUTLAND/SHATTERED HELLSCAPES (~3):
- shattered alien plain with floating rock fragments, blood-red sky, bone-litter scattered, demonic green-fel veins in the ground
- Outland-style overgrown alien savanna with massive purple-skinned grass and floating mountains in the distance
- Hellfire-style demonic hellscape with blood-red sky, scattered skull-monoliths, lava-rivers carving cracked earth

NORTHREND ICY FJORD-WASTES (~3):
- frozen fjord-cliff coastline with ancient longships frozen in ice, low arctic sun, distant mountains shrouded in mist
- icy-tundra plain with scattered ruined giant-stone-pillars, blowing snow, aurora overhead
- glacial canyon with frozen river winding through, ice-cathedral spires rising from the depths, pale blue ambient

PANDARIA MISTY ASIAN-MOUNTAINS (~3):
- misty Asian-coded mountain range with bamboo forests on terraced slopes, distant pagoda silhouettes (no figures), atmospheric haze
- jade-forest valley with massive ancient stone statues half-overgrown, floating temple lanterns, pink cherry blossom drift
- terraced rice-paddies climbing a mountainside with mist between layers, distant zen monastery temple

SHADOWLANDS REALM VISTAS (~4):
- gold-and-blue ascended sky-realm plain with celestial-classical architecture floating overhead, soft glowing ambient
- necromantic underworld with bone-and-fungus terrain, glowing-green tendrils piercing the ground, gothic skull-spires distant
- fey-fae translucent forest with crystalline trees and rainbow-bioluminescent flora, soft purple-violet ambient
- gothic vampire-realm with crimson-and-black sky, gothic spire silhouettes against red moon, blood-rivers flowing

DEMONIC-FEL ARGUS HELLSCAPES (~2):
- demonic planet surface with fel-green crystalline formations and scorched ground, dark red sky, broken obsidian
- fel-corrupted alien plain with green crystals jutting from cracked earth, demonic structures in the distance, oppressive air

TROLL DESERT-RUINS (~2):
- ancient troll-desert with weathered jungle-stepped pyramids half-buried in red sand, twin moons overhead, atmospheric heat
- sun-baked desert plateau with gold-trim ancient pyramid-temples scattered, distant raptor silhouettes, dust drifting

UNDERWATER NAGA / CORAL-FORTRESS (~2):
- underwater fantasy realm with coral-built sea-empire palaces, bioluminescent fish swirling, ancient ruins half-buried in sand
- submerged temple-city with shimmering blue-green water, kelp forests around tower spires, soft refracted sun rays

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO orcs / NO elves-as-figures / NO heroes / NO foreground beasts (distant silhouettes at scale OK)
- NO franchise proper nouns
- HAND-PAINTED-STYLIZED color and lighting — bold, oversaturated, theatrical
- Variety across the 9 categories above mandatory
- Cinematic / fantasy-epic scale
- Skies and atmosphere are heightened and dramatic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
