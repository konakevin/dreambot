#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/siren_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SIREN SETTING descriptions for MermaidBot's mermaid-siren path. Classic siren locations — moonlit rocks, misty coves, dangerous coastlines where ships meet their doom.

Each entry: 10-20 words. A specific siren setting.

━━━ CATEGORIES TO COVER ━━━
- Jagged sea rocks under a full moon with crashing silver waves
- Misty cove entrance with fog rolling across black water
- Cliff base with ship-wreck debris scattered across the rocks
- Tidal cave mouth with echoing waves and phosphorescent spray
- Rocky promontory overlooking a stormy sea at twilight
- Lighthouse ruin on a barren island, beacon long extinguished
- Sea stack column rising from churning foam, wind-blasted
- Hidden grotto behind a waterfall, calm pool inside
- Volcanic black-sand beach with steam rising from hot springs
- Ancient stone pier half-submerged, barnacle-covered and crumbling

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: rock formation type + time of day + weather.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
