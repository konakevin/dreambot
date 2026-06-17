#!/usr/bin/env node
// SETTING axis for TinyBot's tiny-vehicles path — a richly-staged, LAYERED little
// world for the journey to happen in, so the render has depth + a sense of a
// bigger world (fixes the "vehicle on a bare surface = macro product shot"
// failure). Every entry must have foreground / midground / far-distance.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_worlds.json',
  total: 200,
  batch: 50,
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} LITTLE-WORLD settings for TinyBot's tiny-vehicle scenes — the staged miniature world a tiny natural-material vehicle travels through. NOT a bare surface: a whole tiny world with depth, props, and other tiny life going about its day.

Each entry: 18-30 words. MUST describe MULTIPLE DEPTH LAYERS — a foreground, a midground, and a far distance — so the scene reads as part of a bigger world.

━━━ WHAT EACH WORLD MUST HAVE ━━━
- A clear PLACE the journey passes through or arrives at: a harbor, a market, a canal, a village waterfront, a flower-meadow crossing, a rain-gutter river, a teacup lake, a windowsill town, a mushroom-cove dock.
- LAYERS: something near (a dock / reeds / a jetty), something mid (other tiny craft / cottages / stalls), something far (a headland / a lighthouse / a distant shore / hills of grass-blades).
- Signs of a LIVED-IN tiny world: little buildings, rope-rigged docks, market stalls, lantern strings, tiny signposts, moored boats, washing lines — built from natural materials at correct scale.
- Optional distant cute critters going about their day (mice, snails, ladybugs, frogs) as scale + life — peripheral, small.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a bustling acorn-cap harbor: rope-rigged twig docks in the foreground, leaf-sail boats moored midground, a far mossy headland crowned with a snail-shell lighthouse"
- "a windowsill flower-market at dusk, petal-stalls and lantern strings up close, busy little shoppers midground, the vast warm glow of a real house-window behind"
- "a rain-gutter canal winding between pebble cottages, lily-pad jetties near, washing-lines strung across midground, the gutter mouth opening to bright sky far off"
- "a teacup-lake cove ringed with moss banks in front, a twig pier and bobbing craft midground, a hazy far shore of towering grass-blades and a daisy lighthouse"
- "a mushroom-cove waterfront, bracket-cap boathouses near, a market of seed-baskets midground, distant hills of clover fading into golden haze"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO modern vehicles, motors, roads, cars, or machinery.
- NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp). Distant critters, if any, are cute: mouse, snail, ladybug, frog, dragonfly, bird.
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO grim / scary / horror. Cozy, charming, storybook tiny worlds only.

━━━ DEDUP DIMENSIONS ━━━
Vary the PLACE-TYPE (harbor / market / canal / lake / village / meadow / gutter-river / cove) + the materials + the far-distance landmark. No two worlds should share the same place-type + landmark.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
