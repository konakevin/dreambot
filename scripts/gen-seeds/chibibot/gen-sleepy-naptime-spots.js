#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_spots.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} IMPOSSIBLY COZY NAP-SPOT settings for ChibiBot sleepy-naptime — magical tiny places where an adorable chibi creature is curled up dozing. The spot itself is the cozy hero, the creature will be added separately. Each spot is INTIMATE, INVITING, and feels like the most perfect place to fall asleep.

Each entry: 15-25 words. ONE specific nap-spot setting. NO creatures (separate axis). NO time-of-day or weather (separate axes). NO sleep-pose (separate axis).

━━━ THE BAR — TINY IMPOSSIBLY-COZY PLACE TO NAP ━━━

Every entry must (1) be a SMALL INTIMATE NAP-SIZED nook (creature-scale, not human-bedroom), (2) be COZY beyond reason (oversized pillows, soft petals, warm blankets, glowing-warm pocket), and (3) make the viewer want to curl up in it themselves.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% TINY-OBJECT-AS-BED (curled inside a giant teacup with a saucer-blanket / inside an empty acorn-cap on a moss carpet / nestled in a hollowed-out walnut shell with cotton stuffing / inside a music-box with red-velvet lining / in a thimble lined with rose petals / inside an open jewelry box on satin)
- 20% NATURE-BED (curled in a giant flower petal hammock / nestled between two giant mushroom caps / in a moss-bed under a giant fern frond / inside a giant tulip bloom / on a pillow of cotton-grass with dandelion-fluff blanket)
- 15% HUMAN-FURNITURE-MINIATURIZED (inside a tiny brass-bedstead with quilts piled high / on a doll-sized fainting couch with tassels / in a wing-chair tucked in a corner / on a velvet ottoman with a knitted throw)
- 10% HAMMOCK / SUSPENDED (hammock strung between two mushroom stalks / hammock between two oak branches with a canopy of leaves / in a hanging basket lined with feathers / in a swing dangling from a tree branch)
- 10% CLOUD / SKY (curled on a tiny cloud floating in a starlit sky / on a feather pillow in a hot-air balloon basket / on a moon-crescent in a midnight sky / in a star-shaped pillow on a sky-island)
- 10% MAGICAL-REALM (inside a giant glowing crystal lined with moss / in a fairy-ring of toadstools / on a lily-pad in a glowing pond / inside an open bookpages with the story drifting around / inside a music note resting on a staff)
- 5% PORCH / OUTDOOR-COZY (on a porch-swing piled with quilts / in a rocking chair under a porch canopy / on a swinging garden bench with a blanket / in a hanging chair under a tree)
- 5% UNUSUAL-VESSEL (inside a tiny canoe with a leaf-sail / in a sleigh under a fur throw / on a paper-boat with a single rose-petal pillow / in a wheelbarrow filled with hay)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete vessel-type + concrete cozy-detail (soft material, soft texture, oversized pillow, warm blanket)
- Tiny SCALE-anchor (creature-sized, not human-sized)
- ONE signature cozy element (rose-petal-blanket, cotton-stuffing, velvet-lining, knitted throw)
- Picture-able as one mental still frame — the viewer can already feel themselves curling up

━━━ HARD BANS ━━━

- NO creatures
- NO sleep-pose verbs (curled / sprawled — those are sleep-pose axis)
- NO time / weather
- NO dark / haunted / abandoned

━━━ DEDUP ━━━

Dedup by spot-type + cozy material/feature.

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
