#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_creatures.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} BOSS-TIER DARK CREATURE descriptions for GothBot's horror-creature path. These are CASTLEVANIA BOSS ENCOUNTERS — massive, imposing, jaw-dropping creature designs that would be the final boss of a gothic horror game. Each entry is 25-40 words. Gorgeous + terrifying + operatic. The kind of creature art that makes you stop scrolling and stare.

━━━ AESTHETIC NORTH STAR ━━━
Castlevania bosses (Death, Galamoth, Beelzebub, Legion, Dracula's final forms). Bloodborne bosses (Cleric Beast, Vicar Amelia, Ludwig, Orphan of Kos). Berserk apostles (Femto, Zodd, Slan, Void). Dark Souls bosses (Sif, Ornstein & Smough, Nameless King). Devil May Cry demons. Hellboy's Ogdru Jahad. Van Helsing's werewolf transformation. NOT generic fantasy creatures. NOT D&D monster manual. NOT cute monsters. BOSS-TIER — massive scale, operatic horror, devastating beauty.

━━━ CREATURE TYPES (enforce distribution) ━━━

MASSIVE WEREWOLVES / LYCANS (20%) — Van-Helsing / Bloodborne Cleric-Beast scale:
- 9-foot-tall mid-transformation, half-human jaw distending, spine cracking, silver moonlight backlighting the agony
- Pack alpha on hind legs howling, massive barrel-chest, silver-black fur matted with rain, yellow eyes like searchlights
- Werewolf mid-leap across gothic rooftops, claws tearing stone, church spire shattering behind it
- NOT small wolves, NOT cute werewolves — these are BUILDING-SIZED nightmare lycans

VAMPIRES IN MONSTROUS FORM (20%) — Dracula's final form, not aristocrat:
- Ancient vampire shedding human shell — bat-wings exploding from spine, jaw unhinging to reveal triple-row fangs, human clothes tearing away
- Massive chiropteran vampire form — 15-foot wingspan, emaciated torso, translucent skin showing black veins, hanging upside-down from cathedral vault
- Vampire lord mid-transformation into bat-swarm, body dissolving into hundreds of screeching creatures, face the last thing to dissolve
- The MONSTROUS side of vampirism — not the aristocrat, the THING underneath

GARGOYLES / STONE HORRORS COME TO LIFE (15%):
- Cathedral gargoyle cracking free from stone perch, stone chips exploding, one wing still granite while the other flexes living membrane, ember eyes igniting
- Massive stone guardian awakening on gothic bridge, moss and lichen cracking off as joints grind, rain streaming down carved features now showing expression
- Gargoyle choir on cathedral roofline all turning their heads simultaneously toward viewer, stone necks grinding

FALLEN ANGELS / CORRUPTED CELESTIALS (15%):
- Fallen seraph with six tattered wings trailing black feathers, broken golden halo flickering with dying light, tears of black ichor streaming from luminous eyes, hovering above burning cathedral
- Corrupted angel mid-descent through stained-glass window, wings of obsidian replacing former glory, celestial armor cracked showing void beneath
- NOT cute angels — these are TERRIFYING corrupted divine beings, mile-high wingspan, faces too beautiful to look at directly

HELLHOUNDS / DARK BEASTS (10%):
- Massive cerberus-scale three-headed hound mid-charge through cemetery gates, each head trailing different-colored hellfire, chain-leash dragging broken iron post
- Shadow-panther the size of a horse stalking through moonlit cloister, made of living darkness with ember eyes, fog retreating from its footfalls
- Spectral horse mid-gallop across moor, skeletal frame visible through translucent flesh, mane of blue-white ghost-fire streaming

GOTHIC DRAGONS / WYRMS (10%):
- Skeletal dragon perched on ruined cathedral spire, tattered membrane wings spread against blood-moon, green balefire leaking from ribcage, jaw open in silent roar
- Wyrm coiled around castle tower like a serpent, obsidian scales reflecting moonlight, crushing stone as it constricts, single amber eye filling a window

WRAITHS / REVENANTS (10%):
- Massive dullahan on nightmare-horse mid-gallop through fog-choked village street, headless body in tarnished armor holding its own screaming skull aloft, green ghost-fire trailing
- Banshee mid-shriek atop cliff-edge, sound-waves visible as rippling distortion in moonlit air, white hair streaming horizontal, tattered burial-gown, mouth impossibly wide
- Death-archetype figure (NOT skeleton — hooded, face in shadow with only glowing eyes) hovering above battlefield, massive scythe, tattered robes billowing with supernatural wind

━━━ SCALE IS EVERYTHING ━━━
These creatures are MASSIVE. They dwarf buildings. They crack stone when they land. Their wings block out the moon. Their howls shatter windows. They are the thing the hero was warned about. Every entry should convey SCALE — reference architecture, environment destruction, atmospheric distortion. A werewolf isn't "a wolf" — it's a 9-foot-tall muscle-bound nightmare whose shoulders are wider than a doorframe.

━━━ VISUAL DETAIL MANDATE ━━━
Each entry must include: creature anatomy (specific — not just "claws" but "obsidian talons each longer than a human forearm"), action verb (mid-leap/mid-howl/mid-shatter/mid-emerge/mid-transform), scale reference (dwarfing the cathedral/cracking the bridge/blocking the moon), atmospheric anchor (blood-moon, storm-lightning, cathedral ruins, fog-choked graveyard), and ONE specific gorgeous detail (moonlight on wet fur, balefire reflecting in rain puddles, feathers dissolving into shadow-motes).

━━━ HARD BANS ━━━
- NO lamias, nagas, or snake-women (not GothBot aesthetic)
- NO ghouls, zombies, shambling-undead (too generic horror)
- NO mindflayers, krakens, tentacle-monsters (too D&D/Lovecraft)
- NO incubi/succubi (those are in the character paths, not creature)
- NO cute or small creatures (no imp, no goblin, no fairy)
- NO skeletons, liches, bone-monarchs (WoW-undead aesthetic is OFF)
- NO pentagrams, satanic iconography
- NO cheap gore, no slasher imagery
- NO named IP (no Dracula, no Sif, no Cleric Beast by name)
- NO "standing menacingly" — MID-ACTION always

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
