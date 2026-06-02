#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} AQUATIC-VILLAGE DETAILS for ChibiBot aquatic-village — small lived-in details scattered across the village that make it feel inhabited. Template picks 3 per render.

Each entry: 10-20 words. ONE specific detail. NO creatures, NO main setting, NO activity verbs.

━━━ FORMAT — VISIBLE LIVED-IN AQUATIC-VILLAGE DETAIL ━━━

Examples:

✓ "Brass lantern dangling from a coral-arch, glowing warm amber"
✓ "Stack of glowing pearls in a tidepool basin"
✓ "Kelp-fronds swaying gently with the current"
✓ "Drifting fish-school sweeping past a cottage window"
✓ "Bubble-stream rising from a chimney-spout"
✓ "Lily-pad with a tiny tea-set arranged on it"
✓ "Pearl-bead-chain looped between two starfish-bridges"
✓ "Seashell-mosaic pavement with starfish patterns"
✓ "Bioluminescent coral catching turquoise light"
✓ "Anchor-rope coiled outside a submarine-cottage door"

━━━ HARD BANS ━━━

- NO creatures / characters
- NO activity verbs
- NO setting / village descriptions
- NO weather/time-of-day language
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
