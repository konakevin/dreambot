#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_phenomena.json',
  total: 100,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot rainy-day-outdoor scenes — magical, weather, or seasonal events that crank atmospheric drama (60%-gated, fires sometimes).

Each entry: 15-25 words. ONE event woven into a rainy-outdoor frame.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% rain-amplification (heaviest downpour with rain sheeting in slow-motion silver / sudden warm rain breaking through clouds in golden light / hail bouncing playfully off cobblestones / fat lazy raindrops the size of marbles falling slowly)
- 20% rainbow / light-event (perfect rainbow arching impossibly bright above the scene / double rainbow forming between rain clouds / single golden sunbeam piercing through clouds and lighting a puddle / sun-pillar of light vertically descending into rain)
- 15% mist / fog (warm mist rising off heated stones / fog rolling in along a forest floor / steam-curtains over a warm pond / cottony fog wrapping the whole hillside)
- 15% magical phenomenon (floating glowing dandelion seeds drifting through the rain / fireflies daring out in the rain forming a halo around the hero / sparkle-rain mixed with regular rain / wishing-stars descending)
- 10% drift / weather (cherry-blossom petals carried by rain in a swirl / autumn leaves dancing past in a wet gust / falling rose petals catching raindrops / drifting milkweed-floss seeds in the rain)
- 10% pond / water (giant ripple spreading across pond from one perfect splash / lily-pads opening in the rain / koi fish surfacing to catch raindrops / circular waves in concentric ripples across a still puddle)
- 5% animal-event (massive flock of birds suddenly taking off through rain / hare bounding past on a wet meadow / deer pair stepping out of the trees in the distance)

━━━ HARD BANS ━━━

- NO scary / dangerous storms (lightning bolts striking / wind tearing things / flooding / dangerous waves)
- NO indoor scenes
- NO creatures as focal subject

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
