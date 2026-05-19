#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot bath-time scenes — magical or seasonal events that crank atmospheric drama when they fire. This axis is 60%-gated — only fires on some renders — so each entry should be a STATEMENT MOMENT that transforms the bath frame.

Each entry: 15-25 words. ONE magical / seasonal / atmospheric event woven into a bath context.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- A whole-scene phenomenon (not a tiny detail — that's surprise_element)
- Wholesome / wondrous / awe-inducing — NEVER scary
- Concrete and picture-able (Flux must render it)
- Stacks with everything else (creature + bath setting still readable)

━━━ CATEGORY DISTRIBUTION ━━━
- 20% bubble / soap phenomenon (massive rainbow soap-bubble half-engulfing the bather / soap-suds avalanche pouring down the sides / iridescent foam tower rising above the rim / hundreds of perfect tiny bubbles drifting like a galaxy)
- 20% steam / mist event (golden god-rays cutting through the bath steam / rainbow forming inside the steam cloud / mist rising in a perfect spiral / steam billowing in a heart-shaped cloud overhead)
- 15% sky / window phenomenon (golden sunset light beaming through the bathroom window / first snowfall visible through the window while warm bath inside / morning sun-pillar slicing across the tile floor / fireflies swirling outside the open window)
- 15% magical phenomenon (floating glowing dandelion seeds drifting over the bath / will-o-wisps circling the tub / sparkle-rain falling onto the suds / floating petals from nowhere / butterflies emerging from the steam)
- 10% seasonal event (cherry-blossom petals carpeting the outdoor bath / autumn leaves drifting onto the water / first snowflakes melting on the warm surface / spring-rain pattering the canopy above)
- 10% candle / light phenomenon (every candle lighting itself in sequence / fairy-lights flickering on / a single sunbeam finding the perfect spot / moonbeam slicing through frosted glass)
- 5% rare / dreamlike (paper-lantern festival visible through window / aurora borealis green-pink dancing outside / lighthouse beam crossing the room / shooting star streaking past the window)

━━━ HARD BANS ━━━
- NO scary events (no thunder-and-lightning / no scary aurora / no flood / no cold)
- NO weather word-soup overlap (no "raining cats and dogs" / "blizzard outside")
- NO setting language
- NO creatures
- NO bath-failure events (no spilling tub / no water-rising-dangerously / no slippery-falling)

━━━ DEDUP ━━━
Dedup by: phenomenon type + concrete signature. "rainbow soap bubble" and "iridescent giant bubble half-engulfing" are duplicates.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
