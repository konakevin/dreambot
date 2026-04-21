#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for CoquetteBot — soft pastel particles and delicate atmospheric elements. Always soft / warm / romantic / dreamy.

Each entry: 6-14 words. One specific delicate atmospheric element.

━━━ CATEGORIES ━━━
- Pink petal drift (sakura, rose, peach-blossom)
- Fairy dust (drifting pastel sparkles in sunbeam)
- Soft gauzy mist (pastel haze backlit warm)
- Sparkle motes (tiny pinpoint twinkles scattered)
- Warm diffuse glow (pastel halo around subject)
- Drifting pearls (impossible, floating pearl-dots)
- Bubble drift (soap bubbles, iridescent pastel)
- Heart particles (tiny floating pastel hearts)
- Ribbon streamers (drifting silk, pastel)
- Feather drift (drifting pastel feathers)
- Pollen-gold motes (warm gold in pastel backlight)
- Snow-petal drift (white flakes like petals)
- Glitter scatter (soft gold glitter backlit)
- Rose-water mist (fine pastel pink spray)
- Cherry-blossom flurry (sakura cascade)
- Lavender particles (tiny purple-dots drift)
- Dandelion-fluff (backlit white puffs)
- Fireflies soft-pink (magical pastel light)
- Ice-crystal sparkle (delicate, pastel)
- Faint music-notes (drifting, for musical scenes)
- Pink-smoke wisp (cotton-candy plume)
- Steam-rising (soft pastel steam from tea)

━━━ RULES ━━━
- Soft / delicate / romantic only
- Pastel-palette elements
- Adds precious depth

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
