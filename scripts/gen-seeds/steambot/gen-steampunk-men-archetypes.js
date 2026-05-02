#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_archetypes.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} HANDSOME STEAMPUNK MAN ARCHETYPES for SteamBot's steampunk-man path. Each entry is one short character-archetype description — WHO he is at his core. Period-accurate Victorian-industrial era, NOT modern, NOT anime, NOT sexualized.

Each entry: 12-25 words. ONE specific archetype.

━━━ TONE — CRITICAL ━━━
- HANDSOME / DASHING / RUGGED / BROODING / INTENT / CAPABLE / COOL — never "sexy" or "seductive"
- Period-accurate Victorian-industrial / late-19th-century steampunk
- BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Wild-Wild-West / Sherlock-Holmes / Around-The-World-In-80-Days / 20,000-Leagues / Hugo / Hellboy DNA
- He's a CHARACTER with a story — capable, intent on a craft, weathered by his work
- NOT a fashion model. NOT posing. He's DOING something.

━━━ ARCHETYPE TYPES (mix broadly across all entries) ━━━
1. AIRSHIP CAPTAIN — weathered greatcoat, brass spyglass, command bearing
2. GEAR-ENGINEER / MECHANIC — soot-streaked apron, brass tools, intent stare
3. ALCHEMIST / INVENTOR — vest under leather apron, ink-stained fingers, fevered look
4. GENTLEMAN EXPLORER — pith helmet, khaki linen, traveling case, dust-flecked boots
5. BRASS-LIMBED WAR VETERAN — military greatcoat, bronze prosthetic arm/hand, scarred jaw
6. STEAM-RIFLEMAN / HUNTER — leather coat, brass-barreled steam-rifle, predator's calm
7. FACTORY TYCOON — fine wool suit, gold watch chain, gloves on a velvet-handled cane
8. DAPPER OCCULT-INVESTIGATOR — vested with crucifix, steam-revolver holstered, wary eyes
9. RAGGED SKY-PIRATE — patched leather waistcoat, brass-and-leather harness, devil-may-care smirk
10. CLOCKWORK PROFESSOR — tweed jacket with elbow patches, magnifying loupe at one eye, chalk-dusted cuffs
11. BRASS DOCTOR / CHIRURGEON — frock coat with leather doctor's bag, brass-bone-saw, surgical apron
12. TELEGRAPHER / SIGNALMAN — railway cap, leather satchel of code-keys, lantern hooked to his belt
13. RAILWAY ENGINEER — striped overalls, peaked cap, oil-stained cloth in fist, steam-blackened boots
14. NOBLEMAN-ADVENTURER — embroidered waistcoat, dueling-pistol holstered, scarred knuckles
15. FREEMASON / SECRET-SOCIETY OPERATIVE — black cloak with brass clasp, masonic ring, intent gaze
16. AETHER PILOT — leather flying-helmet with brass goggles raised, sheepskin-lined jacket, oxygen tube
17. BLACKSMITH — bare arms under leather apron, hammer in fist, forge-soot on his temples
18. AUTOMATON-MAKER — workshop apron, magnifier-headband, gear-train half-assembled in palm
19. STEAM-GUNSLINGER — duster coat, twin holstered brass-revolvers, pulled-low slouch hat
20. TEA-CLIPPER NAVIGATOR — peacoat with brass buttons, sextant in hand, weathered captain's bearing

━━━ FOR EACH ENTRY INCLUDE ━━━
- Core archetype (what he does for a living / his role)
- 1-2 distinctive identifying details (brass arm, gold watch chain, leather flying helmet)
- His ENERGY in 2-3 words (intent, weathered, dashing, brooding, capable, rugged)

━━━ ABSOLUTELY BANNED ━━━
- NO "sexy", NO "seductive", NO "alluring", NO "smoldering"
- NO modern-era references (no laptops / phones / cars / contemporary fashion)
- NO anime / manga register
- NO underwear / shirtless poses for gratuitousness
- NO supernatural shapeshifters (vampire-counts, werewolves) — keep grounded in steampunk
- NO named real people / IP characters

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Airship captain in weathered brass-buttoned greatcoat, telescope tucked at his belt, scar across his right cheekbone, command-bearing"
- "Gear-engineer in soot-streaked leather apron over white shirt sleeves, brass spanner in fist, intent furrowed brow"
- "Alchemist in vest and ink-stained shirtsleeves, magnifying loupe pinched in one eye, fingertips chemical-stained, fevered concentration"
- "Brass-limbed war veteran in military greatcoat, bronze prosthetic right arm with visible gear-joints, jaw scarred, weary stoicism"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
