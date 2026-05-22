#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_landmark_anchor.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} LANDMARK ANCHOR entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the LARGE SCALE-PROVING ELEMENT in the scene — DOES NOT have to be a vertical tower behind the figure.

CRITICAL VARIETY MANDATE: do NOT default to "massive vertical tower / megabuilding behind figure." That biases every composition into the same center-vertical shot. Spread entries across horizontal / side-positioned / overhead / interior / ground-level / vehicle landmarks.

Each entry: 12-26 words. ONE specific landmark — describe its position relative to the camera/figure (BESIDE / OVERHEAD / BEHIND / IN-FRONT-OF / WITHIN / FAR-DISTANCE).

LANDMARK VARIETY (no category above 18%):
- VERTICAL TOWER (megabuilding, holographic billboard tower, broadcast tower) — keep but reduce
- HORIZONTAL SKY-BRIDGE (suspended glass walkway crossing horizontally across the frame)
- HOVERCAR-HIGHWAY (curving suspended highway, light-trails arcing through frame)
- MEGA-CARGO STRUCTURE (giant container-ship hull, port crane structure, dock-side)
- INTERIOR MEGA-ATRIUM (corp lobby ceiling stretching impossibly high, glass-roof megamall)
- SIDE-POSITIONED MEGABUILDING (anchor on left or right edge of frame, NOT center)
- GROUND-LEVEL MEGA-SCREEN (a building wall = single giant screen at street-level)
- MEGA-BUDDHA-STATUE (cyberpunk-Buddha-statue, augmented with neon prayer-rings)
- OVERHEAD HOVERING STRUCTURE (an airborne mega-platform / suspended sky-mall)
- SUBSURFACE / UNDERGROUND VAULT (massive underground market ceiling, sewer-cathedral)
- STADIUM-SCALE STRUCTURE (cyberpunk arena, mega-event-dome)
- COASTAL / WATERFRONT MEGA-STRUCTURE (mega-bridge across Tokyo Bay, port-tower)
- ABANDONED MEGA-RUIN (Akira-style ruined megabuilding, collapsed structure)

DO write (vary widely + specify position):
- A suspended glass sky-bridge crosses HORIZONTALLY across the upper-mid frame, tiny figures-as-specks walking inside
- A curving hovercar-highway arc cuts ACROSS the upper-left of the frame, light-trails streaming through
- An enormous corporate atrium ceiling looms OVERHEAD, glass-and-steel webbing impossibly high, figures dwarfed below
- A megabuilding face occupies the LEFT EDGE of the frame, asymmetric composition, holographic ad face filling that side
- A cyberpunk Buddha-statue twenty stories tall stands IN-FRONT-OF the figure, neon prayer-rings glowing at the chest
- A mega-cargo-ship hull dominates the BEHIND-CAMERA distance at a port, cranes stretching up like skeletal towers
- An Akira-style collapsed megabuilding ruin sprawls across the deep-distance horizon, crumbled neon still flickering
- A suspended hovering sky-mall platform floats OVERHEAD with hanging cables, ground far below
- A massive ground-level MEGA-SCREEN wall fills the BACKGROUND, anime-character ad as a building-face
- An underground vault ceiling arches OVERHEAD in a black-market scene, cables and ducts dangling

DO NOT write:
- Multiple "tall vertical tower behind figure" entries — that's ONE entry max
- Tiny / human-scale objects (a single vending machine is NOT a landmark)
- Pastoral nature elements
- Historical Japan (no torii / pagoda — those are samurai-era)
- Multiple landmarks per entry — ONE per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
