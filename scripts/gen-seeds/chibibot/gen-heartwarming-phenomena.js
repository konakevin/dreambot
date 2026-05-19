#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/heartwarming_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot heartwarming creature scenes — magical or seasonal events woven into the scene that crank atmospheric drama. This axis is 60%-gated — only fires on some renders — so each entry should be a STATEMENT MOMENT that transforms the frame when it lands.

Each entry: 15-25 words. ONE magical / seasonal / atmospheric event that fills the scene with wow.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- A whole-scene phenomenon (not a tiny detail — that's surprise_element)
- Wholesome / wondrous / awe-inducing — NEVER scary
- Concrete and picture-able (Flux must render it)
- Stacks with everything else (creature + activity + setting still readable)

━━━ CATEGORY DISTRIBUTION ━━━
- 20% seasonal event (first snowfall blanketing everything / cherry-blossom storm whirling petals / autumn leaves cascading in golden showers / spring-blossom explosion of every flower opening at once / wildflower super-bloom)
- 20% celestial / sky (aurora borealis green-and-pink dancing above / meteor shower streaking across sky / double rainbow arching overhead / harvest-moon impossibly large on the horizon / sun-pillar of light)
- 20% magical phenomenon (fireflies-everywhere swarm filling the frame / will-o-wisps drifting in a circle / floating glowing dandelion seeds everywhere / sparkles raining down / wishing-stars descending)
- 15% water event (gentle rain catching golden light / first rainfall after drought / morning-dew everything covered in sparkles / mist rising off a pond at sunrise / waterfall lit by rainbow)
- 10% wind event (breeze sweeping petals through the scene / leaves dancing in a column of warm air / dandelion seeds airborne everywhere)
- 10% light phenomenon (god-rays cutting through trees / sun breaking through clouds for a single golden moment / aurora reflecting in still water below)
- 5% rare/dreamlike (eclipse-soft twilight at midday / paper-lantern festival sky full of floating lanterns / lighthouse-beam crossing the scene)

━━━ HARD BANS ━━━
- NO dark / scary events (no storms with lightning-striking-down / no scary aurora / no eclipse-of-darkness)
- NO weather word-soup overlap (no "raining cats and dogs" / "snowstorm" — phenomena are EVENTS, weather is BASELINE)
- NO setting language
- NO creatures

━━━ DEDUP ━━━
Dedup by: phenomenon type + concrete signature. "aurora overhead" and "northern lights dancing above" are duplicates.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
