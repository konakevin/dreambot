#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for TinyBot — micro-scale particles.

Each entry: 6-14 words. One specific miniature atmospheric element.

━━━ CATEGORIES ━━━
- Pollen-motes in sunbeam (miniature scale)
- Dust-mote drift (tiny scale)
- Fairy-glow around subject
- Miniature steam (tiny kettle)
- Micro-rain (tiny droplets)
- Tiny pollen-cloud
- Snowflakes-miniature
- Tiny bubbles
- Dewdrop-sparkle
- Glitter-scatter (tiny)
- Leaf-petal-drift (miniature)
- Fireflies tiny-cluster
- Smoke from tiny chimney
- Steam-from-tiny-cup
- Cotton-candy-cloud
- Soap-bubble drift
- Tiny-fog-curtain (macro scale)
- Spiderweb-silk-glint
- Pollen-in-miniature-sunbeam
- Morning-mist miniature
- Dandelion-puff miniature
- Tiny-snowdrift backlit
- Glowing-mushroom-spore
- Heart-particles (tiny)
- Music-notes drifting (tiny)
- Tiny butterfly-flurry
- Micro-petal rain
- Paper-confetti (tiny)
- Flour-dust (bakery miniature)
- Tiny-feather-drift

━━━ RULES ━━━
- Tiny / miniature / micro atmospheric elements
- Warm cozy preferred

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
