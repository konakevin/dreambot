#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot fruits-and-veggies renders. The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 GARDEN PROPS (mini watering-can / garden-spade / clay plant-marker / twine ball / seed-packet)
- 4 ORCHARD-AND-TREE PROPS (small wooden ladder / picking-basket / fallen-leaf / blossom-sprig / tree-branch-segment)
- 4 VINE-AND-BUSH PROPS (wooden trellis-segment / garden-bench corner / mulch-patch / stake-sign / netting-fragment)
- 4 BASKET-AND-HARVEST PROPS (wicker handle / linen cloth / harvest tag / wooden crate corner / hand-twined twine)
- 4 FOREST PROPS (mossy log / smooth river-stone / fern-frond / pinecone / tiny mushroom-stool)
- 5 MARKET PROPS (chalkboard-sign / wooden crate edge / paper produce-bag / mini blackboard-price / hand-tied bouquet)

━━━ EXAMPLES ━━━

"A tiny galvanized watering-can with a curved spout"
"A small wooden picking ladder leaning against the tree"
"A fragment of wooden trellis with twined string"
"A folded linen cloth lining the basket bottom"
"A mossy log with sage-green velvet texture"
"A small chalkboard sign with hand-lettered price"

━━━ HARD MANDATES ━━━

- Self-contained — clean when 2-4 combined per render
- Specific item, not a category

━━━ HARD BANS ━━━

- NO color / palette / lighting language
- NO companion creatures
- NO camera / framing language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
