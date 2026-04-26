#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_eye_styles.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CYBORG EYE descriptions for StarBot. Each describes one specific pair of eyes — color, glow quality, and any mechanical augmentation visible. Gender-neutral (shared across male and female cyborgs).

Each entry: 8-15 words. Eye color + glow/luminance quality + one mechanical detail.

━━━ CATEGORIES (spread evenly) ━━━
- Glowing single-color (cyan, amber, violet, emerald, crimson, gold, silver)
- Multi-iris / compound eyes (double/triple iris rings, segmented pupils)
- Mechanical aperture (visible servo rings, targeting reticles, focus mechanisms)
- Bioluminescent (inner glow, pulsing light, shifting color)
- Holographic (data streams, HUD overlays, projection glow)
- Natural-passing with subtle tells (faint ring glow, micro-servo flicker at iris edge)
- Mismatched (one organic one mechanical, two different glow colors)
- Mirror/reflective (mercury-silver, chrome-reflective, light-absorbing void-black)

━━━ RULES ━━━
- No gendered language — these are shared
- Physical visual detail only — what you SEE
- Each entry = color + luminance quality + one mechanical/augmented detail
- Vary glow intensity: some subtle, some blazing

━━━ DEDUP ━━━
No two entries should share the same color AND same mechanical detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
