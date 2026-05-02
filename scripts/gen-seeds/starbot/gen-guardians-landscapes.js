#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/guardians_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GUARDIANS-OF-THE-GALAXY-CODED LANDSCAPE entries for StarBot's guardians-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC COSMIC-WEIRD ALIEN VISTA in the GotG aesthetic tradition — neon nightclub-planets, severed-Celestial-head mining colonies, gold-aesthetic perfect societies, mist-shrouded forest moons, kaleidoscopic crystal worlds, junkyard pirate-town landscapes, vibrant colorful alien biomes, classical-future white-marble cities.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO ALIENS-AS-CHARACTERS, NO SPACESHIPS-AS-FOREGROUND-SUBJECTS. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Knowhere", "Xandar", "Contraxia", "Sovereign", "Berhert", "Yondu", "Star-Lord", "Rocket", "Groot", "Ego", "Nova Corps" — describe the AESTHETIC generically. Use phrases like "severed-giant-skull mining colony interior", "neon nightclub-planet at dusk", "gold-aesthetic classical city", "mist-shrouded forest moon", "kaleidoscopic crystal world".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of James-Gunn-Marvel-cosmic / Jack-Kirby-cosmic / 70s-album-cover-sci-fi / vibrant-saturated-pulp / Heavy-Metal-magazine palette. The cosmos is COLORFUL, GAUDY, EXTRAVAGANT, WEIRD. Every world has its own visual identity, often clashing rainbow-saturated palettes. Less gritty than Star Wars, less hostile than Aliens — playful-cosmic-glamorous-weird. Soft-pastel skies and neon nightlife coexist with brutal mining colonies and classical perfection.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

SEVERED-GIANT-SKULL MINING COLONIES (~3):
- exterior view of a colossal severed alien-being's skull turned mining colony, cosmic vapor venting from eye-sockets, against starfield
- interior of a severed-giant-skull industrial complex, exposed bone-and-metal corridors lit neon, scaffolding within the cavernous skull-cathedral

NEON NIGHTCLUB-PLANETS (~4):
- planet-wide nightclub city at dusk, neon billboards in fifteen languages, pink-and-purple atmospheric haze, hovercraft trails in the sky
- low-orbital approach to a neon-saturated pleasure-planet, magenta and cyan light bleeding into surrounding clouds
- nightlife-city alley with neon signs reflecting in puddles, atmospheric haze, distant tower-club silhouettes

GOLD-AESTHETIC PERFECT SOCIETIES (~3):
- gold-and-white classical city under perfect sun, ornate spires and reflecting pools, manicured cosmic-perfect harmony
- golden palace complex with classical columns, geometric gardens, perfect architectural symmetry, no clouds in the sky
- gold-aesthetic society's spaceport with classical sculptural decoration, immaculate paving, atmospheric heat shimmer

MIST-SHROUDED FOREST MOONS (~2):
- misty forest moon with bioluminescent flora glowing through perpetual fog, towering alien trees, soft cyan-violet ambient
- forest-moon clearing surrounded by mist, alien-flower-bioluminescence carpeting the ground, distant ringed planet

KALEIDOSCOPIC CRYSTAL WORLDS (~3):
- planet of living-crystal formations growing in geometric kaleidoscope patterns, refracted starlight everywhere, surreal proportions
- crystalline plain where every formation pulses with shifting color, rainbow refraction shimmer in the air
- prismatic-canyon world with crystal cliffs splitting starlight into ground-level rainbows

JUNKYARD PIRATE-TOWN LANDSCAPES (~3):
- shanty-town city built from welded spacecraft scrap, neon signage and ramshackle balconies, atmospheric pollution haze
- junkyard moon with mountains of broken starship hulks, smoke columns rising from improvised foundries, scrap-built shacks
- pirate-station exterior on an asteroid, ramshackle additions bolted to original prefab structure, neon and rust everywhere

VIBRANT COLORFUL ALIEN BIOMES (~3):
- alien jungle in clashing-rainbow palette, magenta leaves, cyan trunks, yellow vine-flowers, surreal saturated bioluminescence
- iridescent-coral plain on a humid alien world, every surface shifting through pastel colors as light moves
- candy-pink desert with violet rock formations and lemon-yellow sky, surreal gaudy palette

CLASSICAL-FUTURE WHITE-MARBLE CITIES (~2):
- pristine white-marble city with classical columns and chrome accents, sky filled with hovering vehicles
- elegant orbital city with bone-white architecture, silver-light fountains, distant gas-giant horizon

OUTLAW-FRONTIER PLANETS (~2):
- outlaw frontier town under a dusty orange sky, ramshackle bars and saloons, atmospheric glow from neon signs
- saloon-strip frontier-planet street, dirt-and-neon vibe, hovercrafts parked outside crooked establishments

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO aliens-as-figures / NO spaceships as foreground subject
- NO franchise proper nouns
- Strong COLOR component — saturated, gaudy, neon, classical-perfect, or rainbow-clashing
- Variety across the 9 categories above mandatory
- Mood is COSMIC-WEIRD-COLORFUL — playful, extravagant, vibrant, sometimes seedy
- Less gritty than Star Wars, less hostile than Aliens

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
