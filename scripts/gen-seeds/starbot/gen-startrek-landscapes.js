#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/startrek_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} STAR-TREK-CODED LANDSCAPE entries for StarBot's star-trek-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC ALIEN VISTA in the Star Trek aesthetic tradition — Vulcan red-desert temples, Risa tropical paradise, Bajoran orange-stone monasteries, Borg cube/sphere matte-black assimilation interior, Cardassian station bone-architecture, Klingon volcanic warrior-empire homeworld, classical-future Federation colonies, Trill symbiont caves, Romulan green-and-bronze empire.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO STARSHIP-FOREGROUND-SUBJECTS, NO BORG-DRONES-AS-CHARACTERS. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Vulcan", "Klingon", "Romulan", "Cardassian", "Bajoran", "Federation", "Starfleet", "Borg", "Trill", "Risa", "Deep Space Nine", "Enterprise", "Picard", "Spock" — describe the AESTHETIC generically. Use phrases like "red-desert temple-world", "tropical paradise pleasure-planet", "orange-stone monastery world", "matte-black cube-station interior", "volcanic warrior-empire homeworld".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of CLASSIC-Star-Trek concept-art / NEXT-GENERATION painted-matte tradition / Andrew-Probert / Rick-Sternbach. UTOPIAN-FEDERATION: classical-future white-and-chrome architecture, optimistic-bright daylight, manicured colonies. ALIEN-EMPIRE-DISTINCT: each species/world has a strong color signature (Vulcan red-orange, Klingon volcanic-red, Romulan green-and-bronze, Cardassian bone-and-rust). BORG-INDUSTRIAL: matte-black cube-interior with green-light tubing, sterile mechanical assimilation aesthetic. ANCIENT-MYSTICAL: temple-architecture on red-desert worlds, ancient knowledge culture.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

RED-DESERT TEMPLE WORLDS (~3):
- vast red-rock desert with ancient mountain temple complex carved into a mesa, twin moons rising at dusk
- desert plateau with monolithic ancient temple structures, orange-amber sky, distant logic-priests' citadel (no figures)
- red-rock canyon with carved meditation-temple-niches in the cliffs, blowing dust, single moon overhead

TROPICAL PARADISE PLEASURE-PLANETS (~2):
- pristine tropical beach with classical-future resort architecture, turquoise water, white sand, distant statuary
- tropical pleasure-planet plaza with elegant fountain and palm-trees, classical pavilions, perfect midday sun

ORANGE-STONE MONASTERY WORLDS (~3):
- ancient orange-stone monastery complex on a high plateau, weathered carved facades, river valley below
- temple city of orange-stone with elaborate carved spires, sacred-architecture mood, hovering airships in distance
- religious frontier-world with stone monasteries on cliff-faces, devotional carvings, mist rolling in valley

MATTE-BLACK CUBE-STATION INTERIORS (~3):
- interior of a vast matte-black cube-station with green-light tubing running along every surface, mechanical alcoves
- assimilation-collective interior corridor, hexagonal cells with sterile green-light, cables and conduit everywhere
- cube-station central chamber with vertical green-light pillars and matte-black mechanical architecture

VOLCANIC WARRIOR-EMPIRE HOMEWORLDS (~3):
- volcanic warrior-empire homeworld at dusk, lava rivers crossing rocky plains, jagged mountain fortresses against red sky
- warrior-empire citadel-city carved into a volcanic cliff, banners visible (but no figures), molten-glow ambient
- harsh-orange volcanic landscape with imperial fortress silhouettes, ash drifting, lava-vein cracks across rocky ground

CLASSICAL-FUTURE FEDERATION COLONIES (~3):
- white-and-chrome classical-future colony town under blue sky, geometric architecture, manicured park, optimistic-bright
- pristine colony plaza with reflecting pool, white-marble buildings, Federation-style architecture (NO insignia visible)
- frontier scientific outpost with prefab-but-elegant white modular structures, terraformed garden, distant peaks

ROMULAN GREEN-AND-BRONZE EMPIRE (~2):
- green-and-bronze imperial city under jade-tinted sky, brutalist-classical architecture, militaristic-but-elegant proportions
- bronze-and-jade-stone capital city plaza with imperial obelisks, hovering aircars in the distance

CARDASSIAN BONE-AND-RUST STATION (~2):
- bone-colored station-corridor with rust-amber accent lighting, brutalist-alien architecture, claustrophobic mood
- ochre-bone-architecture station promenade with sloped sand-blasted walls, sodium-amber lighting, alien-bureaucratic mood

ANCIENT MYSTICAL CAVES (~2):
- subterranean cave system with bioluminescent symbiont-pools glowing through translucent walls
- mystical underground temple chamber carved from living rock, soft cyan-green glow from natural pools

PASTORAL ALIEN PLANETS (~2):
- pastoral alien farming colony with rolling hills, exotic-flora pastures, white prefab homesteads, distant hover-tractor
- frontier agricultural world at dawn, mist over fields of alien grain, rustic but futuristic homesteads

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Borg-drones-as-figures / NO starships-as-foreground-subjects (background ships at distance OK)
- NO franchise proper nouns
- Strong COLOR signature per species/world (red-desert, green-bronze, bone-rust, white-chrome, matte-black-green)
- Variety across the 10 categories above mandatory
- Mood ranges UTOPIAN-FEDERATION (optimistic-bright) → ALIEN-EMPIRE (distinct color signature) → BORG-INDUSTRIAL (sterile-mechanical-dread) → ANCIENT-MYSTICAL (sacred-temple)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
