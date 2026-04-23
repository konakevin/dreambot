#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/tabletop_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} TABLETOP-MINIATURE scene descriptions for ToyBot's tabletop-minis path — Warhammer / Dungeons-&-Dragons / Reaper / WizKids painted pewter-or-plastic miniatures arranged on handcrafted terrain dioramas. 28mm–32mm scale figures with visible brush-strokes, drybrushed highlights, base-flocking, mounted on round bases, photographed like a pro-painter's display cabinet lit for a Games-Workshop catalog.

Each entry: 18-28 words. ONE specific cinematic tabletop-miniature battle or narrative scene with painted figures mid-action on a built-up terrain piece.

━━━ THE CHARACTERS ━━━
Painted 28mm-32mm scale tabletop-miniatures — knights, orcs, dwarves, elves, wizards, skeletons, dragons, goblins, paladins, rangers, clerics, barbarians, necromancers, ogres, space-marines. Hand-painted with visible brush-strokes, wash-shading, drybrush-highlights, metallic-armor-paint, freehand shield-crest detail, static-grass/flock bases. Multiple figures per scene — this is a cinematic diorama.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Orc warband charging across a scorched-earth battlefield toward a line of spear-wall dwarves
- Paladin miniature last-stand atop a cobblestone hill, sword raised, skeleton horde ascending
- Dragon miniature perched on crumbling tower, jaws open mid-roar, adventurers below on cliff-edge
- Dwarven hold gate scene — axe-wielding dwarves defending portcullis, goblins climbing walls
- Wizard miniature mid-cast with arcane-blue glowing hand, robes swirling, spell-effect swirling
- Tavern-interior diorama — adventuring party clustered around table, mugs raised, lute-player
- Dungeon-crawl chamber — thief miniature picking lock on treasure-chest, torch-bearer behind
- Siege-tower rolling toward castle wall — pikemen defenders on ramparts, boiling-oil cauldrons
- Necromancer miniature raising skeletons from graveyard, green-glow base, crumbling tombstones
- Knight cavalry charge — lances lowered, banner streaming, foot-archers aiming volley
- Elven ranger on tree-stump ambush — miniature bow drawn, arrow mid-nock, forest-diorama
- Ogre mini crushing cart with warhammer, screaming townsfolk-miniatures fleeing
- Wizard's sanctum — miniature at scroll-cluttered desk, crystal-ball glowing, familiar on perch
- Goblin cave raiders pouring out of cavern mouth, torches held high, drum-bearer
- Undead pirate captain on ship's-wheel diorama, skeleton-crew in rigging, cannon-smoke
- Dragonborn paladin miniature squared off against black dragon on crumbled bridge
- Ruined temple floor-trap scene — rogue leaping over pit, cleric trailing with lantern
- Frost-giant miniature striding through snow-drift, pine-tree diorama, warriors retreating
- Dwarven forge-hall diorama — miniature smith at anvil with orange-glow, bellows-apprentice
- Crypt reveal — adventuring party frozen mid-step as lich miniature rises from sarcophagus
- Cavalry skirmish in wheatfield diorama — knights clashing with orc-wolf-riders mid-collision
- Warlock miniature at summoning-circle with chalk-glyph base, demon-mini materializing
- Hobbit-village riverside scene — minis fishing, gardening, smoking pipes on cottage stoops
- Drow ambush in mushroom-forest — giant-mushroom terrain, stealth-figures mid-strike
- Paladin funeral pyre diorama — fallen knight on bier, companions standing vigil at dusk

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference PAINTED-MINIATURE / tabletop-scale / brush-strokes / flocked-base / terrain-diorama LANGUAGE
- Warhammer / D&D / pro-painter aesthetic — this is COLLECTOR-GRADE display-cabinet toy-photography
- Fantasy archetype specificity (dwarf / orc / wizard / dragon) — don't say "fantasy character"
- Practical display-case lighting (dramatic spotlight / cabinet-LED / warm-key rim-light)
- Cinematic verb — mid-charge / mid-swing / mid-cast / mid-roar

━━━ BANNED ━━━
- NO "real person" / "real creature" — these are MINIATURES on a tabletop
- NO game-IP proper nouns (Frodo / Gandalf / Drizzt / Space Marine chapter names / Astartes) — archetype only
- NO CGI / 3D-render / digital illustration language
- NO sexual content
- NO graphic gore — injured poses OK, no spraying-blood

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
