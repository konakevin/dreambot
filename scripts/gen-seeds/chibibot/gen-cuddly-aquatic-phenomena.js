#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cuddly_aquatic_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot cuddly-aquatic scenes — magical or seasonal aquatic events that crank atmospheric drama when they fire. This axis is 60%-gated — only fires on some renders — so each entry should be a STATEMENT MOMENT that transforms the underwater/surface frame.

Each entry: 15-25 words. ONE magical / seasonal / atmospheric event woven into the aquatic scene.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- A whole-scene phenomenon (not a tiny detail — that's surprise_element)
- Wholesome / wondrous / awe-inducing — NEVER scary
- Concrete and picture-able (Flux must render it)
- Stacks with everything else (creature pair + setting still readable)

━━━ CATEGORY DISTRIBUTION ━━━

- 20% bioluminescent / magical-glow (massive bioluminescent jellyfish bloom swirling through the scene in slow waves / glowing plankton cloud drifting past lighting everything pale-blue / fluorescent coral suddenly all glowing in unison / underwater aurora-curtain shimmering above / wishing-pearls hovering in a cluster)
- 20% light phenomenon (golden sun-pillars cutting through the water in perfect parallel beams / cathedral-shafts of light streaming through kelp canopy / dappled-light caustics carpeting the sea floor in dancing patterns / a single perfect rainbow forming in the spray)
- 15% schooling-life event (vast school of silver fish swirling through the frame in a spiral / sea-turtles drifting past in a procession / pod of dolphins arcing through the upper water / school of glow-fish forming a heart-shape / migration of cuttlefish color-shifting in waves)
- 15% bubble / current event (massive bubble curtain rising from a vent / coral spawning releasing a snowfall of pearl-tiny eggs / gentle current carrying flower-petals on a journey / waterfall plunging into the scene from above creating a curtain)
- 10% seasonal-aquatic (cherry-blossom petals falling through the water surface like snow / autumn-leaves drifting down through clear water / coral spawning a snowfall of color / first ice forming in a thin layer above / kelp-bloom riot of yellow flowers everywhere)
- 10% sky-meets-water (aurora borealis reflecting on the still surface from below / shooting-star streak visible through the water surface / harvest-moon impossibly large above the surface / lighthouse-beam crossing the surface visible from below)
- 5% rare / dreamlike (giant whale silhouette passing in the distance / surfaced dolphin nose-pointing at the pair / sea-dragon-shadow in the deep / pearl-rain falling slowly upward instead of down / time-bubble pause-moment with everything still)
- 5% surface-magic (water lily blooming in time-lapse all around / lily-pads opening in sequence / pond suddenly covered in moonlit lotus blooms / fireflies swirling above the water surface)

━━━ HARD BANS ━━━

- NO scary events (no shark-pass / no stormy water / no flood / no dark currents pulling)
- NO setting language
- NO creatures as the focal subject
- NO predator-prey
- NO weather word-soup (no "hurricane" / "tsunami")

━━━ DEDUP ━━━

Dedup by: phenomenon type + concrete signature. "bioluminescent jellyfish bloom" and "glowing-jelly cloud drifting" are duplicates.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
