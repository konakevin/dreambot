#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/action_hero_scenes.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} "epic 80s action figure" scene descriptions for ToyBot's action-hero path — a rolled-up bucket of vintage 80s/90s action-figure aesthetics covering (a) He-Man / Masters-of-the-Universe muscular-sword-and-sorcery heroes, (b) Star-Wars-era space-adventurer archetypes, (c) generic cape-and-cowl superhero figures, and (d) "epic" franchise-toy DNA more broadly. Non-IP — archetype only, never named characters. Toy-photography on handcrafted playsets with dramatic cinematic lighting.

Each entry: 18-28 words. ONE specific scene with vintage-action-figure(s) mid-action in a handcrafted playset diorama.

━━━ THE CHARACTERS (mix across the three archetype families — rotate) ━━━

FAMILY A — Sword-and-Sorcery Muscle-Hero (He-Man / Masters-of-the-Universe DNA):
- Hyper-muscular hand-painted plastic barbarian-hero figure, shoulder-length hair (blonde / black / platinum), loincloth / fur-boots / leather-cross-strap, signature magic-sword or battle-axe, often bare-chested, swivel-waist articulation
- Muscular sorceress-warrior, crown or tiara, armored bustier, staff or wand with crystal-orb, cape
- Skeletal or animal-headed villain (horned / skull-faced / serpent-faced) in purple-or-black armor with bone-staff
- Muscle-bound armored champion with winged helm, broadsword, round shield, iconic chest-emblem
- Savage warrior-beast — felinoid / reptilian / simian humanoid with mane, fangs, primitive armor

FAMILY B — Space-Adventurer (Star-Wars-era DNA):
- Robed hooded space-monk with glowing laser-sword, belt-pouch, brown-or-cream-colored robe
- Dark-helmeted armored space-villain — full-face mask with chest-control-panel, long cloak, gauntlets
- Scruffy space-smuggler — vest over loose shirt, holster at hip, cocky grin, bucket-helmeted alien co-pilot
- Small astromech or protocol-style plastic droid with antenna-head / dome-head / segmented-arm
- Rebel-pilot with flight-helmet and orange-or-blue flight suit, X-pattern cross-harness, chin-strap
- Armored bounty-hunter with T-visor helmet and jet-pack, arm-gauntlet weaponry
- Fur-covered towering alien-sidekick with crossed bandolier
- Alien-cantina grotesque — tentacle-faced / bug-eyed / horned alien in motley robes

FAMILY C — Cape-and-Cowl Superhero (generic non-IP):
- Caped champion with chest-emblem (not a real one — geometric / elemental / animal-silhouette), bright primary-color bodysuit, domino mask or full cowl
- Dark-armored vigilante in black-and-grey, hooded / cowled, utility-belt, grappling-gun
- Winged hero — feather-cape or mechanical wings, crested helmet, sword or scepter
- Cosmic hero — glowing-ring or glowing-staff, starfield-cape, tiara or crown
- Amazon / warrior-queen — metal tiara, bracers, armored skirt, sword-and-shield
- Powered-armor hero — full-body plated mechanical-suit, glowing chest-reactor, arm-repulsor
- Super-villain archetype — horned mask, cape, taloned-gloves, imposing scepter

━━━ SCENE CATEGORIES (rotate — balance across the three families + scene types) ━━━
- Muscle-hero castle-siege diorama — barbarian-hero mid-leap with magic-sword raised, skeletal-villain on throne behind rising mist
- Sorceress mid-spell — staff raised, energy-crystal glowing mid-air, magic-particles suspended in the diorama set
- Beast-warrior riding an articulated plastic saber-tooth mount across a molded-rock-bridge, enemies below
- Space-monk laser-sword duel — two hooded figures mid-clash on a metallic gantry over glowing pit, cape whirling
- Dark-helmet villain on bridge of plastic starship with cloaked officers saluting, viewport stars behind
- Cantina standoff — smuggler with drawn blaster, alien grotesque across the plastic bar-top, droid peeking from behind stool
- Droid at console — astromech-style droid plugged into plastic-terminal with sparks arcing from its access-port
- Rebel-pilot running toward plastic-fighter-cockpit across hangar-set, ground-crew helmeted figures waving
- Bounty-hunter cornering prey — jet-pack ignited, carbine raised, cornered target crouched behind plastic cargo crate
- Caped-hero rooftop silhouette — wind-flared cape, city-skyline diorama behind, moon-glow backlit haze
- Winged hero mid-dive — sword pointed downward, cape spread, city rooftops small beneath in playset-perspective
- Powered-armor hero mid-repulsor-blast — arm extended, concussion-ring mid-bloom, villain thrown backward across alley
- Vigilante crouched on gargoyle — grappling-gun in one hand, cape falling around him, cityscape behind
- Cosmic-hero floating above a plastic-asteroid — starfield-cape billowing, energy-ring glowing at hand, alien landscape below
- Amazon warrior parrying sword-strike — crossed bracers, muscled villain mid-lunge, Greek-temple diorama behind
- Super-villain on throne — horned mask, cape draped, hand gripping scepter, minion-figures kneeling in formation at base
- Heroes-vs-villains gauntlet — five hero-figures lined up against five villain-figures in a plastic arena, mid-charge
- Muscle-hero shoulder-lifting a boulder overhead, allies mid-escape beneath
- Barbarian-hero back-to-back with armored-champion against a ring of skeletal-minion figures
- Space-hero fleeing plastic-corridor firefight — blaster-fire bolts frozen mid-air as trio sprints toward extraction
- Dark-helmet villain entering smoke-filled hangar diorama — stormtrooper-style troopers flanking, gantry above
- Caped-hero welcoming rookie into plastic-headquarters — giant emblem wall, trophy-cases of defeated villain-props behind
- Super-team launch sequence — six heroes leaping from plastic-hangar-door toward open sky, smoke-plume behind
- Sorceress summoning a plastic-dragon — figure flying toward her open palm from above the throne-room diorama
- Cosmic-gauntlet showdown — villain with glowing-stone gauntlet on a plastic cosmic-pillar, heroes scrambling up from below
- Winged-villain perched on a skull-throne surrounded by minion-figures, hero-team climbing the pyramid toward them
- Beast-warrior rising from plastic-jungle — saber-tooth mount beside, bow drawn, spear-brandished allies flanking
- Space-monk training-sequence — young hero with hooded master-figure, laser-swords crossed, rocks floating mid-air

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference ACTION-FIGURE / articulated-figure / 5-to-7-inch or 3.75-inch / hand-painted / playset-diorama LANGUAGE explicitly
- Vintage 80s/90s action-figure toy-photography energy — plastic, playful, epic-serial-cinematic
- Specific archetype NAME (barbarian-hero / sorceress / space-monk / dark-helmet villain / caped-champion / vigilante / powered-armor hero / bounty-hunter / droid) — never "man" / "woman" / "superhero" alone
- Signature prop — magic-sword / staff / laser-sword / blaster / grappling-gun / shield / scepter / chest-emblem / cape
- Cinematic mid-action verb (mid-leap / mid-clash / mid-blast / mid-stride / mid-parry / mid-fall)
- Practical-diorama lighting cue (dramatic spotlight / backlit rim-light / fog-haze / laser-bolt-glow)

━━━ BANNED ━━━
- NO real IP names (He-Man / Skeletor / She-Ra / Luke / Vader / Han / Leia / Chewbacca / C-3PO / R2-D2 / Darth Maul / Boba Fett / Batman / Superman / Wonder Woman / Iron Man / Thor / Spider-Man / Joker — ANY real hero/villain name) — archetype language only
- NO real franchise-specific proper nouns (Lightsaber / Force / Mjolnir / Infinity Gauntlet / Hogwarts / Castle Grayskull / Eternia)
- NO named-company references (Marvel / DC / Mattel / Hasbro / Kenner)
- NO CGI / illustration / digital-render language
- NO graphic gore / blood
- NO sexual / mature content
- NO classic green-army-men / WWII-soldier material — those belong to other paths
- NO 1980s articulated-commando military-figures — those belong to gi-joe path

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
