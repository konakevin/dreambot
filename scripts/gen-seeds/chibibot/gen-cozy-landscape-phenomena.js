#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot cozy-landscape scenes — magical, seasonal, or atmospheric events that crank atmospheric drama when they fire (60%-gated, fires sometimes).

Each entry: 15-25 words. ONE magical / seasonal / atmospheric event woven into the cozy-world frame.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- A whole-scene phenomenon (not a tiny detail)
- Wholesome / wondrous — NEVER scary
- Concrete and picture-able
- Stacks with everything else (world + resident still readable)

━━━ CATEGORY DISTRIBUTION ━━━

- 20% seasonal (first snowfall blanketing the village in a silent layer / cherry-blossom storm whirling petals through the lanes / autumn leaves cascading in a golden cloud / spring-blossom riot of every flower opening / wildflower super-bloom)
- 20% sky / celestial (rainbow arching impossibly bright after rain / aurora borealis green-pink curtain over the village / harvest-moon impossibly large on the horizon / double-rainbow / single perfect sunbeam through clouds)
- 15% weather-event (gentle warm rain catching golden light / mist rolling through the meadow at knee-height / soft snow falling on a candlelit village / cottony fog wrapping the cliffside cottage)
- 10% magical phenomenon (floating glowing dandelion seeds drifting everywhere / sparkle-rain falling slowly / paper-lantern festival sky full of floating lanterns / wishing-stars descending)
- 10% wind / drift event (petal-storm sweeping across the meadow / dandelion-seed snow / autumn leaves dancing in a column / silk-banners fluttering on the breeze)
- 10% light phenomenon (god-rays cutting through trees onto the village / single sunbeam finding the perfect spot / fire-warm window-glow lighting an entire alley / lighthouse beam crossing the bay)
- 10% animal-procession (massive butterfly migration through the meadow / V-formation of geese passing overhead / school of glow-koi rippling through a pond / sparrow-flock writing patterns in the sky)
- 5% rare / dreamlike (eclipse-soft twilight at midday / time-bubble pause-moment with everything still / shooting-star streaking past in daylight / once-a-century bloom)

━━━ HARD BANS ━━━

- NO scary events (no thunder-lightning / storm / blizzard / flood / dark currents)
- NO weather word-soup (no "hurricane" / "tornado")
- NO setting language
- NO creatures as focal subject

━━━ DEDUP ━━━

Dedup by phenomenon-type + signature.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
