#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot unexpected-places renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for the 6 venue sub-themes (greenhouse / library / train / amusement-park / aquarium / rooftop-garden).

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 GLASS-DAPPLED GREENHOUSE LIGHT (filtered through glass panels with plant shadows)
- 4 WARM AMBER LIBRARY LAMP (brass-and-amber pool, deep cozy surround)
- 4 GOLDEN-WINDOW TRAIN LIGHT (warm wash across linen + window-light from outside)
- 4 STRING-LIGHT CARNIVAL GLOW (warm string-light pop + ambient dusk)
- 4 COOL UNDERWATER AQUARIUM GLOW (rippling blue-cyan + soft white window)
- 5 ROOFTOP GOLDEN-HOUR (warm sweeping golden vista + soft city ambient)

━━━ EXAMPLES ━━━

"Soft warm light filtered through glass greenhouse panels with dappled plant-leaf shadows on the subject"
"Warm amber lamp pool from above with deep cozy library surround, soft drop shadow underneath"
"Golden window light raking across a linen-covered table, soft warm wash from outside countryside"
"Warm string-light glow overhead with ambient carnival dusk, gentle warm fill on subject"
"Cool rippling underwater-aquarium glow washing the subject from one side, soft white ambient fill"
"Sweeping golden-hour vista light, warm amber wash across the rooftop and skyline"

━━━ HARD BANS ━━━

- NO photographer name-drops, NO camera specs, NO lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
