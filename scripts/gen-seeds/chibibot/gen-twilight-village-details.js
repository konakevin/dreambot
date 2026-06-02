#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} TWILIGHT-VILLAGE DETAILS for ChibiBot twilight-village — small lived-in details scattered across the village that make it feel inhabited. Template picks 3 per render.

Each entry: 10-20 words. ONE specific detail. NO creatures, NO main setting, NO activity verbs.

━━━ FORMAT — VISIBLE LIVED-IN TWILIGHT-VILLAGE DETAIL ━━━

Examples:

✓ "Paper-lantern strand hanging across a cobblestone lane, warm-amber glow"
✓ "Firefly drifting near a moss-covered cottage door"
✓ "Moonlit-window with lace-curtain catching silver light"
✓ "Glowworm-trail constellation on a cave-ceiling"
✓ "Candle-window glowing warm-amber through fog"
✓ "Reflection of paper-lanterns on a glassy-still canal"
✓ "Moonflower in full bloom catching pale moon-light"
✓ "Bioluminescent-mushroom-cluster glowing soft cyan"
✓ "Wisteria-cluster overhanging a paper-lantern strand"
✓ "Distant Milky-Way visible above a village spire"

━━━ HARD BANS ━━━

- NO creatures / characters
- NO activity verbs
- NO setting / village descriptions
- NO weather/time-of-day language
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
