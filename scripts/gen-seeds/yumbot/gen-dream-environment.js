#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_environment.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ENVIRONMENTAL FEATURES for a kawaii pastel-meadow dreamscape. Each entry is ONE STANDALONE or CLUSTERED feature that adds depth to the meadow scene — NOT a linear / Z-axis / receding element.

Each entry: 12-22 words. ONE specific environmental feature. Painterly Studio-Ghibli-meets-bex.ai pastel register.

DO write features that anchor the scene as standalone objects or clusters:
- A single pastel cherry-blossom tree with cascading pink petals
- A cluster of mossy pastel-boulders heaped together
- A small floating pastel-rock-island hovering above the meadow
- A cluster of giant pastel-mushrooms with spotted caps
- A glassy pastel-pond (just the pond, no surroundings)
- A small flower-bed of pastel cosmos in a tight patch
- A sparkling pastel-crystal-cluster outcrop
- A gentle pastel-hill rising in the foreground
- A weathered pastel-wishing-well
- A pastel-rainbow ribbon arching softly across the sky
- A standalone pastel-stone-archway covered in vines
- A small pastel-gazebo with curved frosted-glass roof
- A heaped pile of pastel pillows / cushion mounds
- A pastel-clam-shell containing a glowing pearl
- A pastel weathervane atop a candy-cane pole

DO NOT write any entries containing these patterns:
- stream / river / brook / creek / canal / waterfall / flowing-water / cascading-water
- path / pathway / trail / lane / road / cobblestone / stepping-stones-trail
- bridge / footbridge / arched-bridge / spanning / crossing
- "winding through" / "running across" / "stretching to" / "leading"
- row / rows / lined with / alongside

These ban patterns create center-receding Z-axis composition that ruins the render — Flux fills the center with a path or stream every time. Keep features STANDALONE or CLUSTERED, never linear or directional.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
