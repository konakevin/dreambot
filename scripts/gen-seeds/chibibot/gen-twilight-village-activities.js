#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} TWILIGHT-VILLAGE ACTIVITIES for ChibiBot twilight-village — what a small peripheral creature is doing in the twilight village foreground. Story-beat actions.

Each entry: 12-22 words. ACTIVE VERB-LED. Include a specific biome-fitting prop or destination. NO creature species names.

━━━ FORMAT — ACTIVE VERB + BIOME-FITTING PROP ━━━

Examples:

✓ "Mid-walk down a lantern-lit lane carrying a single paper-lantern aloft"
✓ "Hauling a glowworm-jar across a moonlit stone-bridge"
✓ "Lighting a paper-lantern at a festival-stall, mid-strike"
✓ "Mid-skip through a firefly-meadow with arms outstretched"
✓ "Hanging a string of paper-lanterns between two cottage-eaves"
✓ "Mid-step across a moonflower-meadow toward a glowing cottage"
✓ "Carrying a candle-jar through a glowworm-cave entrance"
✓ "Mid-lift of a paper-lantern as it floats up into the sky"
✓ "Releasing a sky-lantern at the village center, arms raised"
✓ "Mid-skip across a wisteria-and-firefly arched path"

━━━ HARD POSE-BANS ━━━

✗ "Sitting / standing / looking" — replace with mid-action verbs

━━━ HARD BANS ━━━

- NO creature species names
- NO scary / sad imagery
- NO multi-creature scenes — SOLO peripheral creature only
- NO village description (those come from settings pool)
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
