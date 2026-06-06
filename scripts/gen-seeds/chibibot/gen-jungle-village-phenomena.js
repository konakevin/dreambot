#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_phenomena.json',
  total: 100,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot jungle-village — magical / atmospheric events that crank drama when they fire (60%-gated).

Each entry: 15-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% canopy-light event (golden god-rays cutting through the canopy in dramatic shafts / single sunbeam finding the perfect spot / cathedral-shafts of light filtering down)
- 20% magical phenomenon (floating glowing dandelion seeds drifting through the village / bioluminescent vines suddenly lighting up / paper-lantern festival sky / fireflies-cluster filling the canopy)
- 15% weather (warm rain catching golden light / mist rolling through the canopy / fog wrapping the treehouses / first dewfall on every leaf)
- 15% flower-bloom event (orchid super-bloom across the village / cherry-blossom equivalent of jungle flowers / flowering vines opening in sequence / passion-flower riot)
- 10% animal-event (butterfly migration through the village / parrot flock passing overhead / monkey-pair swinging through / pollinator-cloud)
- 10% celestial / sky (rainbow forming through warm rain / aurora-faint visible above canopy / harvest-moon impossibly large)
- 5% lantern / fire event (every lantern-flower lighting in sequence / village paper-lantern-release / single-flame ceremonial event)

━━━ HARD BANS ━━━

- NO scary storms / lightning / damage
- NO setting / creatures as focal subject

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
