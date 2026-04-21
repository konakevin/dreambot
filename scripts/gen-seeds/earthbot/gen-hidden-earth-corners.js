#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/hidden_earth_corners.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} HIDDEN EARTH CORNER descriptions for EarthBot — intimate discovery / small-scale tight-frame earthly nature. The "hidden-corner" path — quiet, personal, the place-you-stumble-into moments.

Each entry: 15-30 words. One specific intimate earthly nature corner.

━━━ CATEGORIES TO DRAW FROM ━━━
- Moss-covered streams in old-growth forest
- Fern-curtained grottos with trickling water
- Tide pools at low tide with kelp and starfish
- Mossy waterfalls in rainforest understory
- Sunlit forest clearings with wildflowers
- Tiny coves accessible only at low tide
- Lichen-covered stones along a creek bend
- Pitcher-plant bogs in alpine meadows
- Fallen-log microbiomes with mushrooms + moss
- Slot canyons with light-bars on sandstone
- Mossy-boulder creek pools in hemlock forest
- Tiny sandy beaches inside sea caves (just sand, no people)
- Fern-gullies in temperate rainforest
- Spring-fed pools in desert oasis canyons
- Shaded stream-beds with polished round stones

━━━ RULES ━━━
- NO humans
- NO animal subjects (maybe peripheral tiny invertebrate — never the focus)
- TIGHT or MID frame — NOT wide panorama
- Intimate / discovered / tucked-away feel
- Earth-plausible biological/geological specificity
- NO fantasy, NO cosmic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
