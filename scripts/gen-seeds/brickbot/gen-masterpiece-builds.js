#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/masterpiece_builds.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO MASTERPIECE BUILD descriptions for BrickBot. Each is a standalone LEGO creation — NOT a diorama or scene, but an individual build that is an art object. Think LEGO Masters TV competition pieces.

Each entry: 15-25 words. One specific standalone build.

━━━ BUILD TYPES (mix broadly across ALL) ━━━
- Life-size objects: guitar, camera, typewriter, telephone, sneaker, helmet
- Animals: photorealistic parrot, wolf, eagle, koi fish, chameleon with color gradient
- Kinetic sculptures: working clock, spinning mobile, wave machine, pendulum
- Fashion: ball gown, high-heel shoe, handbag, crown, jewelry
- Vehicles as art: classic car, motorcycle, spaceship — built as display piece not in scene
- Food: giant hamburger, sushi platter, wedding cake, fruit bowl
- Impossible objects: Escher staircase, Möbius strip, Klein bottle, Penrose triangle
- Busts and portraits: human head with emotion, character face, self-portrait
- Nature as sculpture: bonsai tree, flower bouquet, coral formation, crystal cluster
- Functional objects: working pinball machine, chess set, music box, safe with combination

━━━ RULES ━━━
- STANDALONE builds on display — not part of a scene or diorama
- Emphasize build technique: SNOT, color gradients, organic curves
- Gallery or competition showcase energy
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
