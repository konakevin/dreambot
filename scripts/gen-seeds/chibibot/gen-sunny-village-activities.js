#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} SUNNY-VILLAGE ACTIVITIES for ChibiBot sunny-village — what a small peripheral creature is doing in the sunny village foreground. Story-beat actions.

Each entry: 12-22 words. ACTIVE VERB-LED. Include a specific biome-fitting prop or destination. NO creature species names.

━━━ FORMAT — ACTIVE VERB + BIOME-FITTING PROP ━━━

Examples:

✓ "Mid-step down a Santorini cliff-stair with a basket of lemons"
✓ "Hauling a wood-cart of olives down a sun-baked cobblestone alley"
✓ "Hanging laundry on a clothesline between two terracotta-roofs"
✓ "Mid-pour from a blue-painted ceramic pitcher onto a stone-step herb-garden"
✓ "Carrying a fishing-net up a wooden dock-stair"
✓ "Mid-bite of a sliced peach as paws rest on a sun-warm stone-wall"
✓ "Pushing a wooden cart of bread loaves toward a bougainvillea-shaded doorway"
✓ "Sweeping a sun-bleached terracotta porch with a long-handled straw broom"
✓ "Mid-stroll past a blue-tiled fountain with a wicker hat shading"
✓ "Hanging chili-pepper strings on a sun-bleached adobe wall"

━━━ HARD POSE-BANS ━━━

✗ "Sitting / standing / looking" — replace with mid-action verbs

━━━ HARD BANS ━━━

- NO creature species names
- NO scary / sad imagery
- NO multi-creature scenes — SOLO peripheral creature only
- NO village description (those come from settings pool)
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
