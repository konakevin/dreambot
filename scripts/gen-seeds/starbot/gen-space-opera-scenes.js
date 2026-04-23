#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/space_opera_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SPACE OPERA SCENE descriptions for StarBot's space-opera path. Epic ships + cosmic scale. The SHIPS are the stars — varied, visually stunning, from across ALL sci-fi design traditions. NOT just grey naval carriers.

Each entry: 15-30 words. One specific scene featuring one or more visually distinct ships.

━━━ SHIP DESIGN VARIETY (CRITICAL — spread evenly) ━━━
- Sleek needle-ships — dart-shaped, aerodynamic, chrome or white, speed-built racers
- Massive industrial haulers — boxy, scarred, container-stacked cargo titans
- Organic living ships — grown not built, bioluminescent hulls, membrane wings, coral-like
- Ancient alien monoliths — geometric impossible shapes, obsidian/gold, clearly not human-designed
- Elegant diplomatic yachts — sweeping curves, translucent hull sections, luminous running lights
- Brutalist war-fortresses — angular, armored, gun-bristling, intimidation-designed
- Ring-ships — rotating habitat rings, centrifugal gravity, visible interior sections
- Solar sail vessels — vast gossamer light-sails catching stellar wind, delicate + massive
- Modular kit-bash ships — cobbled from salvage, asymmetric, jury-rigged, pirate/smuggler aesthetic
- Crystal ships — faceted translucent hulls refracting starlight, alien mineral technology
- Seed-pod colony ships — bulbous biome-domes clustered on spine, generation arks
- Stealth ships — matte black, angular radar-deflecting surfaces, near-invisible against void
- Cathedral ships — gothic spires, stained-glass viewports, religious-order vessels
- Swarm fleets — thousands of tiny coordinated drones moving as one organism

━━━ SCENE TYPES (mix evenly) ━━━
- Ship in dramatic environment (emerging from nebula, silhouetted against star, orbiting gas giant)
- Fleet formation (varied ship types together, convoy, armada, trade flotilla)
- Ship in action (docking, launching, jumping, deploying, scanning, harvesting)
- Ship at rest (drydock, anchor, derelict, discovered wreck)
- Ship vs environment (navigating asteroid field, surfing solar flare, threading planetary rings)

━━━ RULES ━━━
- SHIP DESIGN is the visual star — describe hull shape, material, scale, unique features
- No named IP ships (no Enterprise, no Falcon, etc.)
- NO "naval carrier transposed into space" — no grey aircraft carriers with engines bolted on
- Vary scale wildly — single-pilot fighters to moon-sized vessels
- Each scene should make you think "I want to see that ship"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
