#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_sky.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} OVERHEAD/SKY/CANOPY descriptions for a kawaii cottagecore-nature scene — what's directly above the scene.

Each entry: 12-22 words. ONE specific overhead description.

DO write:
- A soft pastel-blue summer sky with fluffy cumulus clouds drifting peacefully
- A canopy of cherry-blossom branches with petals slowly drifting down
- An archway of cascading wisteria in pastel-lavender blooms
- A canopy of oak-tree leaves with sun-dappled gold filtering through
- A trellis of climbing roses overhead in soft pink and cream
- A canopy of willow-branches trailing softly downward
- A cottage thatched-roof edge with warm-glow lantern hanging from a hook
- An apple-tree canopy with ripe fruits dangling and a few falling
- A soft pastel-pink sunset sky with golden-amber clouds
- A canopy of climbing-honeysuckle with bees floating between blooms
- A warm rustic wooden-beam overhang with strung bunting flags
- A sky of late-afternoon golden bokeh through a willow canopy
- A canopy of wildflower-stems arching delicately overhead
- A starry indigo twilight sky with paper-lanterns strung between trees
- A cottage gable with potted geraniums in window-boxes above
- A canopy of hanging baskets dripping with petunias and lobelia
- A soft pearly morning sky with dawn-pink wisps of cloud
- A canopy of dried-flower wreaths and macramé hangings
- A garden gazebo lattice with climbing-jasmine in fragrant white blooms
- A wide pastel-cream sky with a single drifting hot-air-balloon in the distance

DO NOT write:
- Foreground (foods, characters, ground)
- Modern aircraft / satellites / drones (the hot-air-balloon is OK as nostalgic)
- Pathway / lane / surface — overhead only
- Dark / scary / stormy sky

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
