#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_activities.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ARCTIC-VILLAGE ACTIVITIES for ChibiBot arctic-village — what a small peripheral creature is doing in the snow-village foreground. Story-beat actions that make the scene feel lived-in.

Each entry: 12-22 words. ACTIVE VERB-LED. Include a specific arctic prop or destination. NO creature species names.

━━━ FORMAT — ACTIVE WINTER-LIFE VERB + WHERE THEY'RE GOING ━━━

Examples:
✓ "Pulling a sled stacked with firewood toward a snowy cottage porch"
✓ "Hauling a basket of ice-caught fish across a frozen-bridge"
✓ "Lighting a glass-jar lantern at a snowy lamp-post, mid-strike with a match"
✓ "Hanging a knit-mitten on a clothesline strung between two snowdrifts"
✓ "Stomping snow off boots at a cottage door with mittened paws"
✓ "Carrying a steaming thermos through fresh snowfall toward a porch"
✓ "Mid-shovel of a snow-walkway in front of a candy-cane fence"
✓ "Sweeping snow off a porch step with a tiny straw-broom"
✓ "Pulling a string of fairy-lights toward a snow-blanketed pine-tree"
✓ "Skating tentatively across a frozen-pond with arms-out-wobble"
✓ "Carrying a pine-bough wreath toward a cottage door, paws full"
✓ "Pushing a small wood-cart of icicle-sticks down a snowy lane"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% HAULING / CARRYING (pulling sled with firewood / hauling fish-basket / carrying thermos / pushing wood-cart / carrying wreath)
- 15% LIGHTING / DECORATING (lighting a lantern / hanging fairy-lights / hanging a wreath / lighting a candle in a window)
- 15% MAINTAINING (shoveling snow / sweeping porch / knocking snow off a roof / chopping kindling / stoking a fire-pit)
- 10% WINTER-PLAY (skating wobbly across frozen-pond / mid-snowball-throw / making snow-angel / building snowman / sledding down a hill)
- 10% ARRIVING / DEPARTING (stomping snow off boots at cottage door / waving goodbye on a porch / mid-knock at a wooden door / stepping out into snowfall)
- 10% TENDING (feeding a chickadee on a windowsill / refilling a hot-cocoa-pot / scattering crumbs for birds / mid-stir of stew in a pot)
- 10% CRAFT / KNIT (mid-knit of a tiny scarf on a porch-bench / mid-fold of a wool-blanket / mid-pour of cocoa from a thermos)
- 5% NAVIGATING (crossing a frozen-bridge / climbing snowy steps / wading through a snowdrift / cresting a snow-ridge)
- 5% PEEKING / DISCOVERING (peeking around a candy-cane fence / paws-pressed-to-window peeking at a warm-amber interior / discovering paw-prints in the snow)

━━━ HARD POSE-BANS ━━━

✗ "Sitting" (passive — replace with mid-action)
✗ "Standing in the snow" (replace with verb-led specific destination)
✗ "Looking at the village" (replace with mid-action towards a specific point)

━━━ HARD BANS ━━━

- NO creature species names (snow-fox / polar-bear / etc. — those come from creature pool)
- NO scary / sad / cold-suffering imagery
- NO multi-creature scenes — SOLO peripheral creature only
- NO village description (those come from settings pool)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
