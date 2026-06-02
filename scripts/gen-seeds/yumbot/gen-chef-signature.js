#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_signature.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ICONIC KITCHEN SIGNATURE elements for a kawaii mini-chef kitchen scene. Each entry is ONE specific kitchen prop or tool that anchors the scene as a kawaii kitchen.

Each entry: 10-18 words. ONE specific element.

DO write:
- A standing-mixer in pastel-pink with whisk attachment
- A heavy wooden rolling-pin dusted with flour
- A copper saucepan hanging on a hook
- A vintage kawaii kettle with smiling face on the side
- A stack of pastel-rainbow macaron tins
- A wooden cutting-board with scattered cherry-tomato slices
- A row of pastel canisters labeled FLOUR / SUGAR / BUTTER in kawaii script
- A bamboo steamer stack with curls of soft steam rising
- A wooden cake-stand displaying a frosted tiered cake
- A row of glass spice-jars in a kawaii-painted rack
- A cast-iron skillet with a small heart-shaped omelet sizzling
- A vintage scale with weighted bowls in pearl-cream
- A bamboo whisk in a small ceramic holder
- A row of mini cookie-cutters in heart and star shapes
- A wooden honey-dipper in a glass honey-jar
- A pastel-pink mortar and pestle
- A wooden chopping-board with a row of pastel mochi-balls
- A stack of bamboo dim-sum baskets with steam curls
- A pastel piping-bag with stars and shells nozzles
- A kawaii kitchen-timer in the shape of a smiling tomato

DO NOT write:
- Modern electric / industrial / commercial equipment
- Real kanji / Japanese-text labels — keep all signage as decorative-pattern
- Foreground characters (foods, chefs)
- Whole-kitchen scenes (those are in backdrop axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
