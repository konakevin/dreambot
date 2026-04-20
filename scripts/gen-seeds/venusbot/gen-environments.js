#!/usr/bin/env node
/**
 * Generate 50 ENVIRONMENTS — background / setting descriptions for
 * closeup path (face dominates; environment is texture behind her).
 *
 * Each describes a specific setting she could be in, with distinctive
 * visual character. Surreal-adjacent — not purely realistic locations.
 *
 * Output: scripts/bots/venusbot/seeds/environments.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/environments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENT / BACKGROUND descriptions for a cyborg woman's close-up shot. The face dominates the frame; the environment is texture/atmosphere BEHIND her, not the subject.

━━━ WHAT MAKES A GOOD ENTRY ━━━

- Distinctive setting with clear visual character
- Can be architectural, natural, cosmic, abstract, surreal — wide mix
- Implies atmosphere (lighting, mood, scale) without over-describing

━━━ CATEGORIES TO MIX ━━━

- Cyberpunk urban (alleys, rooftops, nightclubs, subways — BUT vary)
- Baroque / gothic architecture (palaces, cathedrals, ornate halls)
- Natural surreal (crystal caves, liquid-metal oceans, impossible geography)
- Cosmic / astronomical (nebula backdrops, alien planets, space stations)
- Ruins / ancient (temples, crumbling monuments, overgrown stone)
- Industrial / lab (neon-lit labs, derelict factories, cryo-chambers)
- Interiors (velvet lounges, mirrored elevators, candlelit salons)
- Abstract / art-installation (infinite mirror rooms, void spaces, color fields)

━━━ CONTENT ━━━

Each entry is 10-20 words. Evocative, specific, texturally vivid. Always backdrop-scale — she is CLOSE UP in the frame, the environment is blurred/depth-of-field behind.

━━━ BANNED ━━━

- No second figures in the environment (no crowds, no other people)
- No props she's interacting with (those belong to path-specific axes)
- No setting that ties to a specific named place ("Times Square", "Notre Dame" — keep generic-evocative)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
