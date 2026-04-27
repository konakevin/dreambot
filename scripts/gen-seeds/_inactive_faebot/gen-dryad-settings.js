#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/dryad_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRYAD SETTING descriptions for FaeBot's dryad path. Ancient tree locations where tree spirits dwell — massive old-growth trees, sacred groves, forest hearts.

Each entry: 10-20 words. A specific ancient tree environment.

━━━ CATEGORIES TO COVER ━━━
- Hollow interior of a thousand-year-old oak, root-woven walls
- Base of a massive redwood, trunk wider than a house, ferns at its feet
- Weeping willow canopy touching a still dark pond, curtain of branches
- Ancient birch grove with paper-white trunks and golden leaves
- Gnarled apple orchard in bloom, petals falling like snow
- Forest of petrified trees, half stone half living wood
- Lightning-struck oak still alive, split trunk glowing with inner light
- Cedar grove in rain, bark deep red, mist rising from the canopy
- Banyan tree with dozens of aerial roots forming a natural cathedral
- Cherry tree at peak bloom next to a mossy stream
- Fallen giant tree trunk covered in moss, new saplings growing from it
- Ash tree at a crossroads with offerings left among the roots

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: tree species + tree condition (ancient/damaged/blooming) + surrounding terrain.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
