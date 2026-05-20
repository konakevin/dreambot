#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_details.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} JUNGLE-VILLAGE DETAILS for ChibiBot — the tiny architectural / nature / prop details that populate a cozy jungle village. Each render picks 3 (pickN:3).

Each entry: 8-15 words. ONE specific jungle-village detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% ARCHITECTURE (bark-and-thatch hut with carved wooden door / mossy-roof cottage with climbing vines / hanging-bottle-home with rope-ladder access / banana-leaf awning over a doorway)
- 15% LANTERN / LIGHT (lantern-flower streetlamp glowing soft / hanging glow-mushroom cluster / paper-lantern strung between treehouses / firefly-jar nightlight on a porch)
- 15% MARKET / COMMERCE (woven-vine fruit-basket at a stall / wooden barrel of dried herbs / hand-painted shop sign carved in bark / hanging spice-bundles)
- 15% FLORA / FAUNA (giant orchid clustered around a doorway / hanging banana-bunch from a beam / fern-pot on a balcony / hanging-vine with single bloom)
- 10% VINE / ROPE (rope-bridge linking two treehouses / vine-ladder twisting up a trunk / woven-vine railing / hanging-vine curtain)
- 10% PATHWAY (stone path winding between huts / wooden-plank walkway / mossy-tile patio / spiral wooden-stair around a trunk)
- 10% TEXTILE / DOMESTIC (laundry line strung between huts / banana-leaf canopy / hammock on a balcony / woven-mat rolled at a doorway)
- 5% MAGICAL (glowing-acorn nightlight / luminous moss patch / fairy-dust drifting over a porch / wisp of magical smoke from a chimney)

━━━ HARD BANS ━━━

- NO creatures
- NO time / weather / activity
- NO modern-tech

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
