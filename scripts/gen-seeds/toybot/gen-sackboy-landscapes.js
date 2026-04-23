#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/sackboy_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LITTLEBIGPLANET-WORLD LANDSCAPE scene descriptions for ToyBot's sackboy path. Media-Molecule craft-world — every element is fabric / felt / yarn / paper / cardboard / button with visible thread-stitching.

Each entry: 15-25 words. ONE specific LBP-world landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure LBP craft-world landscape, NO stitched-characters. Hand-sewn / cardboard-crafted environment IS the subject.
- ~70% Type B — ONE off-center stitched Sackboy-style figure (burlap body, zipper-chest, button-eyes, yarn-hair) in a specific body-shaping pose within an LBP landscape. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Landscape dominates frame.

━━━ CONTEXT DNA ━━━
- LBP environments: felt-hills / cardboard-cottages / patchwork-quilt fields / stitched-fabric islands / button-studded night-skies / corduroy-palm-trees / yarn-meadows / felt-mountains / cardboard-factory / fabric-ocean / stitched-autumn / craft-world-carnival / LBP-cardboard-farm / felt-lighthouse / fabric-cave / craft-world-temple / yarn-city / felt-desert / cardboard-subway / craft-world-castle
- Figure DNA: burlap / hessian brown-sackcloth body, zipper-chest, button-eyes, felt-mouth, yarn-hair, visible thread-stitching at every seam

━━━ MUST-HAVE ━━━
- Reference FABRIC / FELT / YARN / BURLAP / BUTTON / CARDBOARD / STITCHED / thread-embroidered LANGUAGE
- LittleBigPlanet / Media-Molecule craft-world aesthetic
- Type A = zero stitched-figures. Type B = exactly ONE stitched-figure, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per landscape-type

━━━ BANNED ━━━
- NO centered-hero figure
- NO multi-figure entries
- NO passive verbs
- NO real brand/IP names
- NO CGI / illustration / photorealism

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
