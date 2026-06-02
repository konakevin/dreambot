#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_decor.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} DECOR elements for YumBot rainbow-dreamscape — small details in the foreground / midground meadow around the kawaii cups. Template picks 3 per render.

Each entry: 10-18 words.

━━━ DISTRIBUTION ━━━

- 25% CHERRY-BLOSSOM (cherry-blossom branches arching into frame / cherry-blossom-petal-rain drifting / cherry-blossom-tree silhouette in midground)
- 20% MEADOW-FLOWERS (cluster of pastel-cosmos in foreground / scattered pastel-poppies in the grass / pastel-daisy-meadow patches)
- 15% BUTTERFLIES (pastel-butterfly fluttering near the cup / single butterfly resting on a flower / cluster of butterflies in midground)
- 10% MUSHROOMS (cluster of pastel-mushrooms in the grass / pastel-toadstool dotting the meadow / tiny pastel-mushroom-cluster)
- 10% DEWDROPS / PEARLS (dewdrops glistening on grass blades / pastel-pearl-orbs floating in the air / iridescent dew-cluster)
- 10% FLOATING-PETALS (drifting pastel-petals in the air / scattered cherry-blossom-petals on the grass / floating rose-petals)
- 5% SMALL-CRITTERS-STYLIZED (pastel-bunnies-stylized in the deep midground / pastel-rabbit-silhouette / pastel-deer in haze)
- 5% LIGHT-SPECKLES (fairy-light specks throughout the meadow / sparkle-pollen-cloud / floating-glitter)

━━━ HARD MANDATES ━━━

- Pastel palette
- Multi-cluster (NOT solo singletons)

━━━ HARD BANS ━━━

- NO cups (other pool)
- NO rainbows (other pool)
- NO sky-elements (other pool)
- NO industrial / modern

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
