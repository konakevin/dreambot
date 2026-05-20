#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} COTTAGECORE-VILLAGE ACTIVITIES for ChibiBot cottagecore-village — what a small peripheral creature is doing in the cottagecore village foreground. Story-beat actions.

Each entry: 12-22 words. ACTIVE VERB-LED. Include a specific biome-fitting prop or destination. NO creature species names.

━━━ FORMAT — ACTIVE VERB + BIOME-FITTING PROP ━━━

Examples:

✓ "Mid-stroll down a cobblestone lane with a wildflower-bouquet"
✓ "Pushing a wheelbarrow of apples toward a cottage door"
✓ "Hanging laundry on a clothesline strung between flower-laden hedges"
✓ "Watering window-box geraniums on a half-timbered cottage porch"
✓ "Picking lavender bunches and tying them with twine"
✓ "Mid-knock at a wisteria-draped wooden cottage door"
✓ "Carrying a basket of fresh-baked bread down a flower-edged path"
✓ "Tending bees at a wooden bee-skep, mid-puff of smoker"
✓ "Sweeping a stone-pavement porch with a straw-broom"
✓ "Mid-lift of a watering-can over a cottage-garden rose"

━━━ HARD POSE-BANS ━━━

✗ "Sitting / standing / looking" — replace with mid-action verbs

━━━ HARD BANS ━━━

- NO creature species names
- NO scary / sad imagery
- NO multi-creature scenes — SOLO peripheral creature only
- NO village description (those come from settings pool)
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
