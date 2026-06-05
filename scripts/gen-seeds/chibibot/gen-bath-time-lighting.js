#!/usr/bin/env node
/**
 * ChibiBot bath-time LIGHTING — collapses time-of-day + light source +
 * dominant color cast into one ~15-word phrase. New pool for the
 * lean 6-axis rebuild (2026-06-05).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_lighting.json',
  total: 100,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING descriptions for ChibiBot bath-time renders. Each entry combines TIME OF DAY + LIGHT SOURCE + DOMINANT COLOR CAST into a single ~15-word phrase.

Each entry: 12-18 words. One specific lighting moment.

━━━ FORMAT — vivid + concrete, time + source + color ━━━

"Late-afternoon honey light pouring through windows, warm amber falling across the bath rim."
"Pre-dawn cobalt sky outside, soft pearl-grey light through frosted glass, cool blue-violet ambient."
"Bright tropical midday, white-hot sun caustics rippling across the water, sky-blue highlights."
"Evening interior glowing soft amber, candle flames flickering on copper, warm honey-orange tones."
"Cool silvery moonlight through small windows, deep blue shadows pooling along the floor."
"Soft grey overcast afternoon, even milk-white diffuse light, no shadows, hushed cool ambient."
"Rich sunset peach and tangerine pouring across the porch, sun low across the water."
"Aurora green-and-violet ribbons glowing through the skylight, cool blue-green water reflections."
"Hearth-firelight casting warm copper across the room, deep amber shadows in every corner."

━━━ VARIETY ACROSS TIMES OF DAY (roughly 2-3 entries each) ━━━

- Golden hour (late afternoon → sunset warm light)
- Blue hour (pre-dawn / post-sunset cobalt)
- Bright noon (high sun, hot light)
- Candlelit interior (warm flickering)
- Moonlit night (cool silvery)
- Overcast soft (diffuse milk-white)
- Rainy grey (cool dim ambient)
- Aurora night (green/violet glow)
- Sunset coastal (peach/tangerine)
- Hearth-firelight (amber room glow)
- Lantern-lit (paper / oil / brass lantern accents)
- Dappled daylight (forest canopy / window-blinds patterns)

━━━ THE BAR — every entry meets all 3 ━━━

- Names the TIME (dawn / morning / noon / afternoon / golden hour / blue hour / sunset / evening / night / pre-dawn)
- Names the LIGHT SOURCE (sun, candle, moon, lantern, aurora, hearth, dappled window light, etc.)
- Names the DOMINANT COLOR CAST (amber, peach, silver, cobalt, pearl-grey, milk-white, honey, green-violet, etc.)

━━━ OUTPUT ━━━

JSON array of ${n} strings. One per line. No preamble, no numbering, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
