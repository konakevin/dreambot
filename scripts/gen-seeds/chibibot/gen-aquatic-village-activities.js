#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} AQUATIC-VILLAGE ACTIVITIES for ChibiBot aquatic-village — what a small peripheral creature is doing in the aquatic village foreground. Story-beat actions.

Each entry: 12-22 words. ACTIVE VERB-LED. Include a specific biome-fitting prop or destination. NO creature species names.

━━━ FORMAT — ACTIVE VERB + BIOME-FITTING PROP ━━━

Examples:

✓ "Mid-drift across a coral-bridge with a kelp-basket of pearls"
✓ "Pushing a lily-pad-raft toward a floating-village dock"
✓ "Lighting a coral-lantern at a sea-cave entrance"
✓ "Hauling a satchel of glowing-shells up a starfish-bridge stair"
✓ "Mid-stroke as paws-press against the water, gliding past a pearl-shell cottage"
✓ "Pouring water from a brass-spouted pot onto a tide-pool garden"
✓ "Carrying a string of bubble-lanterns toward a kelp-cottage"
✓ "Mid-leap from one lily-pad-raft to the next, kelp-basket in tow"
✓ "Mid-paddle in a tiny shell-boat between coral-towers"
✓ "Hanging a pearl-strand garland between two kelp-cottages"

━━━ HARD POSE-BANS ━━━

✗ "Sitting / standing / looking" — replace with mid-action verbs

━━━ HARD BANS ━━━

- NO creature species names
- NO scary / sad imagery
- NO multi-creature scenes — SOLO peripheral creature only
- NO village description (those come from settings pool)
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
