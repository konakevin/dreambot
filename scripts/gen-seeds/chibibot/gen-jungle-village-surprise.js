#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_surprise.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot jungle-village scenes — tiny secondary details the eye finds AFTER the main resident in the wider village.

Each entry: 12-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny background creature (toucan perched on a far branch / tree-frog peeking from a leaf / sleepy sloth curled in a hammock above / butterfly cluster on a flower / monkey-pair swinging in distance)
- 20% other-resident-in-distance (background resident hauling fruit on a far walkway / silhouetted neighbor on a distant treehouse balcony / pair of villagers on a far rope-bridge)
- 15% NATURE-DETAIL (giant orchid bloom near the village / spider-web jeweled with dewdrops between vines / single firefly already glowing / pressed flower on a path)
- 15% DOMESTIC (laundry hung on a vine line / open mason jar of preserves / wheelbarrow filling with rainwater / leaf-cup of water on a step)
- 10% smoke / steam (chimney smoke curling through canopy / steam rising from a kettle / smoke ring from a far hut)
- 10% magical-ambient (glowing-mushroom cluster / firefly forming a heart / floating glow-pollen / wisp of magic from a treehouse)
- 5% sky / canopy event (single sunbeam piercing through canopy / glowing leaf falling through filtered light)

━━━ HARD BANS ━━━

- NO main subject / hero creature
- NO indoor scenes
- NO time/weather amplification
- NO scary / threatening

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
