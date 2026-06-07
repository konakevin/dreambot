#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot narrative-action renders.

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 WARM KITCHEN GLOW (oven-light + counter-bounce, baking-in-progress-coded)
- 4 SUNNY GARDEN LIGHT (warm overhead sun, dappled leaves, garden-harvest-coded)
- 4 SOFT SHOP-WINDOW REFLECTION (window-glass reflection + warm interior pull, shop-window-coded)
- 4 BRIGHT PARADE-STREET (sunny street + festive ambient, parade-coded)
- 4 INTIMATE TEA-TABLE WARM POOL (single warm pool, tea-party-coded)
- 5 GOLDEN-HOUR DELIVERY LIGHT (warm sun on cobblestones, magical-city-coded)

━━━ EXAMPLES ━━━

"Warm kitchen oven-glow from below mixed with soft overhead counter-bounce, gentle amber wash"
"Warm sunny overhead garden light with dappled leaf-shadow patches across the subject"
"Soft warm interior pull through shop-window glass with reflection layered on top"
"Bright parade-street sunshine with festive ambient fill, gentle warm tint"
"Intimate warm pool of light over the tea-table from above, deep cozy surround fading off"
"Golden-hour sun on cobblestones with warm honey-amber wash and soft long shadows"

━━━ HARD BANS ━━━

- NO photographer name-drops, camera specs, lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
