#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCTIC-VILLAGE DETAILS for ChibiBot arctic-village — small lived-in details scattered across the snowy village that make it feel inhabited. Template picks 3 per render.

Each entry: 10-20 words. ONE specific detail. NO creatures, NO main setting, NO activity verbs (other than light-on / smoke-rising / etc.).

━━━ FORMAT — VISIBLE LIVED-IN ARCTIC-VILLAGE DETAIL ━━━

Examples:
✓ "Knit-blanket folded on a porch-swing with a half-empty mug beside"
✓ "Smoke curling lazily from a stone chimney, drifting against pine branches"
✓ "Snow-shovel leaning against a cottage door, snow piled at its base"
✓ "Footprint trail in fresh snow leading toward a candy-cane fence-gate"
✓ "Icicle-string dripping slowly from a cottage gutter, catching warm-window-light"
✓ "Fairy-light strand draped between two pine-trees, glowing soft warm-amber"
✓ "Pine-bough wreath with red-berry accents hanging on a wooden cottage door"
✓ "Sled parked at a porch, tipped on its side, snow dusting the runners"
✓ "Frozen-pond mirror reflecting cottage-window-glow at the village center"
✓ "Wood-stack covered in fresh snow with an axe stuck in the top log"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% DOMESTIC-LEFT-OUT (knit-blanket on porch-swing / mug beside lantern / sled parked / shoes by door / shovel leaning)
- 15% SMOKE / STEAM (chimney smoke / hot-spring steam / thermos-steam / breath-puffs visible)
- 15% LIGHTING-DETAIL (fairy-lights / lit lanterns / candle-window-glow / lantern-post-glow / paper-lantern strands)
- 15% NATURE-DETAIL (icicle-string from gutter / snow-laden pine-branch / fresh-snowfall on roof / frost-crystals on window / pine-cone scattered)
- 10% DECOR (pine-bough wreath on door / jingle-bell garland / fairy-light strand / mistletoe / bunting)
- 10% TRAIL / TRACK (paw-print trail / footprint trail / sled-track / boot-print path / fresh-snow markings)
- 5% WATER-FEATURE (frozen-pond reflecting lights / icicle-fountain / frozen-stream / snowy water-pump)
- 5% TOOL / EQUIPMENT (sled / snow-shovel / wood-axe / ice-skates hanging / snowshoes by door / fishing-rod leaning)
- 5% FOOD-DETAIL (steaming-stew-pot on outdoor-stove / drying-fish-rack / cookie-tray cooling on a snowy ledge / icicle-of-frozen-syrup)

━━━ HARD BANS ━━━

- NO creatures / characters
- NO activity verbs (no "shoveling" — that's an activity; instead "shovel leaning against door")
- NO setting / village descriptions
- NO weather/time-of-day language
- NO modern tech (except polar-station instruments where biome calls for it)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
