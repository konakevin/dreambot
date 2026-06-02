#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_shelters.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY-SHELTER-FROM-RAIN settings for ChibiBot rainy-day-cozy — outdoor scenes where chibi friends find a COZY SHELTER from the rain. The shelter is small/intimate (one giant mushroom cap, a covered porch, under a leaf, inside a hollow log, beneath a stone bridge). Rain falls VISIBLY around the shelter while the friends stay dry and warm inside it.

Each entry: 15-25 words. ONE specific cozy shelter setting in the rain. NO creatures (separate axis). NO time-of-day or weather (separate axes). NO activity (separate axis). Just the shelter + its outdoor rainy surrounding.

━━━ THE BAR — INTIMATE OUTDOOR SHELTER WITH RAIN AROUND IT ━━━

Every entry must (1) be OUTDOOR (creatures are not in a house — they're in a sheltered outdoor pocket), (2) describe a SMALL INTIMATE shelter (one mushroom cap, one porch corner, one hollow log, one umbrella), (3) imply RAIN falling around the shelter (the contrast IS the magic), and (4) feel like a place 2-4 friends would huddle together cozy.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% NATURAL SHELTER (giant red-capped mushroom in a wet forest / hollow oak with mossy interior / under a giant leaf in a wet meadow / inside a curled fern frond / beneath an overhanging rock with moss / under a giant lily-pad floating on a pond)
- 20% PORCH / COTTAGE COVER (covered porch of a cottage with rain dripping off the eaves / cottage doorway nook with porch swing / cabin window-bay overhang / treehouse veranda with thatched roof / market stall awning)
- 15% BRIDGE / STONE SHELTER (stone arch-bridge with dry alcove beneath / gazebo with peaked roof in a wet garden / pergola wrapped in dripping vines / cottage shed with open doorway / stone alcove in a garden wall)
- 15% UMBRELLA-AS-SHELTER (giant red polka-dot umbrella planted in a wet meadow / oversized rainbow beach-umbrella on grass / black bumbershoot tilted as wind-shelter / parasol propped on a wet picnic blanket)
- 10% TREE-BASED (under a wide-canopied oak with rain dripping from leaves / inside a treehouse with rain on the roof / hammock strung between two trees under a canopy / under a weeping willow's curtain of branches)
- 5% VEHICLE / TRANSIENT (wooden cart parked under a tree / overturned wheelbarrow as makeshift shelter / boat tied to a dock with canvas-covered cabin / gypsy-wagon doorway with curtains drawn back)
- 5% MAGICAL SHELTER (glowing mushroom canopy / fairy-circle of toadstools forming a roof / hollow ancient ruin / mossy stone temple alcove with rain in shafts of light)
- 5% PICNIC / OUTDOOR-EVENT (canopy-tent in a wet meadow / striped market-awning in a courtyard / wedding-arch wrapped in flowers with rain falling beyond)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete shelter type + concrete outdoor surrounding
- RAIN visibly affecting the surrounding (dripping, falling around the shelter)
- ONE signature detail (warm light from inside / dripping eaves / moss on the shelter / wet grass surrounding)
- Picture-able as a single still

━━━ DEDUP ━━━

Dedup by: shelter type + surrounding feature.

━━━ HARD BANS ━━━

- NO creatures
- NO indoor scenes — this is OUTDOOR with an outdoor-shelter pocket
- NO time / weather language
- NO activity verbs
- NO dark / haunted / abandoned

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
