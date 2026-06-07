#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot scale-twist renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for the 6 scale sub-themes.

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 DRAMATIC CITY DUSK (warm-cool mix, giant-real-world-coded)
- 4 INTIMATE WARM MICRO (soft tabletop bounce, microscopic-coded)
- 4 GOLDEN-HOUR ISLAND VISTA (warm sweeping wash, food-island-coded)
- 4 SOFT GLOSSY CHOCOLATE-RIVER (warm rim catching the glaze, chocolate-river-coded)
- 4 CAUSTIC UNDERSEA SHAFTS (rippling cool light shafts, underwater-coded)
- 5 COSMIC GLOW (starlight + nebula, food-in-space-coded)

━━━ EXAMPLES ━━━

"Dramatic dusk city lighting with warm street-lamp tones and cool sky blue, golden rim on subject"
"Warm intimate tabletop bounce light from ant-level, soft amber close fill"
"Sweeping golden-hour vista light, warm amber wash across the entire island"
"Warm gleaming rim-light catching glossy chocolate-river highlights, soft ambient fill"
"Caustic underwater light-shafts rippling across the subject, cool blue surround"
"Cosmic nebula glow with starlight specular highlights, deep purple and magenta surround"

━━━ HARD BANS ━━━

- NO photographer name-drops, NO camera specs, NO lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
