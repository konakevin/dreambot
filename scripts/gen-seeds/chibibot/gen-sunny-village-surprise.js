#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} SURPRISE-ELEMENT descriptions for ChibiBot sunny-village — tiny second-tier details the eye finds after the village + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away surprise detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% TINY-CREATURE (a cat napping on warm tiles / a lizard on a sun-baked wall / a sparrow on a balcony rail / a dove on a wire / a butterfly on bougainvillea)
- 15% FLORAL (a cascade of bougainvillea / a sunflower in a terracotta pot / a citrus-tree heavy with fruit / a bougainvillea-fall)
- 15% LIVED-IN (terracotta-pot of basil / a wicker chair by a door / a sun-hat on a wall / a half-finished glass of lemonade / hanging laundry)
- 10% SEA-VIEW (distant sailing-boat / a glimpse of blue sea past cottages / a fisherman's small painted boat / a coastal-view through an arch)
- 10% TRAIL (a sandy footpath / a pebble-stone alley / sand-tracked stairs)
- 10% WATER-FEATURE (a blue-tiled fountain / a stone water-pump / an oasis-pool / a dripping ceramic-jar)
- 10% CULINARY (drying chili-peppers / cured-ham hanging / olive-jars stacked / lemon-basket on a step)
- 5% TOOL (a fishing-net coiled / a wooden boat-paddle / a wheel-barrow of olives)
- 5% MAGICAL-WARMTH (a single sun-shimmer in the air / a heat-haze visible / a saturated-light-pillar)

━━━ HARD BANS ━━━

- NO main creature / hero creature
- NO setting / village language
- NO time / weather / activity verbs
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
