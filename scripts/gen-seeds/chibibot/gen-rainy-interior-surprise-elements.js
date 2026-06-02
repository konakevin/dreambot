#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_surprise_elements.json',
  total: 150,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot rainy-day-outdoor scenes — tiny secondary details the eye finds AFTER the hero creature. These add life and charm to the wider rainy outdoor world.

Each entry: 12-25 words. ONE specific element.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% wet wildlife (snail leaving a glistening silver trail across a leaf / songbird shaking off water on a fence post / sleepy frog tucked under a mushroom-cap / earthworm slowly crossing a wet path / squirrel-pair sharing a leaf-umbrella)
- 20% reflections / puddles (puddle reflecting the rainbow forming above / puddle showing a tiny upside-down village / chain of puddles down a path each catching different sky / wet stones gleaming with light)
- 15% drift / falling (single petal floating on a puddle / leaf spinning down through rain / dandelion-seed clinging to a wet stone / spider-web jeweled with raindrops shimmering)
- 15% other-creatures-in-distance (background figure crossing a far bridge with umbrella / silhouetted neighbor watching from a covered porch / distant kids in raincoats running / pair of ducks splashing in a far pond)
- 10% domestic-outdoor (laundry hanging on a line getting wet again / pair of rubber boots upside-down on a porch railing draining / wheelbarrow filling with rainwater / overturned watering can)
- 10% magical-ambient (single firefly improbably out in the rain / floating glow-mushroom amid wet ferns / sparkle-rain caught in a leaf cup / will-o-wisp peeking from a hollow log)
- 5% rainbow / light-event (faint rainbow arching in the distance / single sunbeam piercing through clouds onto a puddle / mist rising from warm stones)

━━━ HARD BANS ━━━

- NO main subject / hero creature
- NO indoor scenes
- NO time / weather amplification language
- NO scary / threatening

━━━ DEDUP ━━━

Dedup by element-type + concrete detail.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
