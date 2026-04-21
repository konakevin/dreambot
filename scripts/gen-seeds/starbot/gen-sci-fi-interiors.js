#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_interiors.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCI-FI INTERIOR descriptions for StarBot's sci-fi-interior path — epic interior scale. Space-station bridge, starship corridor, cathedral-hangar, Blade-Runner apartment, minimalist lab. Production-art polish.

Each entry: 15-30 words. One specific epic sci-fi interior.

━━━ CATEGORIES ━━━
- Space-station bridge (vast command deck with holographic star-map, viewports)
- Starship corridor (curved tube with light-strips, door-repeat perspective)
- Cathedral-hangar (vast docking bay with ships suspended, god-rays)
- Blade-Runner apartment (rain on window, neon reflections, sparse minimalist)
- Interstellar library-construct (endless bookshelves, impossible architecture)
- Minimalist lab (pristine white, holographic interface, single scientist absent)
- Engine-room cathedral (massive reactor core with catwalks around)
- Holographic briefing room (floating 3D star-map, conference table)
- Observation-dome (transparent dome overlooking planet from orbit)
- Cryo-sleep chamber (rows of cryopods with misty blue light)
- Archive-vault (endless data-crystals on shelves)
- Medical-bay futuristic (single bed with curving med-scanner arm)
- Dyson-sphere interior (curved inner surface, distant star at center)
- Alien-ship control room (organic curves, bioluminescent panels)
- Warp-drive chamber (spiraling energy conduits, glowing blue)
- Hydroponics bay (rows of plants, grow-lights, green haze)
- Reactor-core chamber (massive glowing cylinder, catwalk perspective)
- Ship-docking umbilical (flexible tube interior between two ships)
- Jumpgate control room (panoramic window onto jumpgate ring)
- Command-tower observation (view of city-planet surface below)
- Asteroid-mining facility interior (rough-hewn stone + tech)
- Zero-g gymnasium (rotating ring with running figures — empty here)
- Chapel-in-space (minimalist religious space with starfield window)
- Alien-temple interior (monolithic chamber with strange glyphs)
- Cryogenic storage hangar (massive facility with countless pods)
- Central AI chamber (massive core with interface-chair)
- Orbital-solarium (glass-domed sun-room overlooking planet)
- Vertical-farm-spire interior (multi-level plant rows)
- Bridge of doomed-ship (power flickering, emergency lighting)
- Generation-ship town-square (interior habitat park)

━━━ RULES ━━━
- Epic scale + awe-worthy composition
- No characters (or peripheral silhouette only)
- Blade-Runner / Interstellar / Alien / 2001 production-art

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
