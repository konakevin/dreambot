#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for GlamBot — editorial-shoot atmospheric elements.

Each entry: 6-14 words. One specific fashion-editorial atmospheric element.

━━━ CATEGORIES ━━━
- Smoke (dramatic studio smoke rolling)
- Light-streaks (neon-streak backdrop)
- Rain (heavy editorial rain)
- Wind-in-hair (hair blowing dramatically)
- Lens-flare (dramatic strobe flare)
- Gold-dust drift (glitter in beam)
- Rose-petal rain
- Sparkle-dust across lens
- Cherry-blossom drift (editorial)
- Feather-drift (shed editorial feathers)
- Bubble-drift (soap bubbles)
- Motion-blur streaks
- Heat-shimmer desert
- Snow-flurry editorial
- Dust-motes in backlight
- Fog-curtain editorial
- Rain-on-glass window
- Wet-pavement reflections
- Water-splash mid-frame
- Liquid-paint cascade
- Ink-in-water plume
- Gold-flake shower
- Holographic-shimmer film
- Mirror-shards floating
- Glitter-rain cascade
- Steam rising (editorial)
- Confetti explosion
- Feathers-drift soft
- Reflective-foil sheets
- Paper-fragment storm
- Dramatic studio-strobe flash visible
- Lens-ghost highlight
- Bokeh-lights out-of-focus

━━━ RULES ━━━
- Editorial shoot atmospheric variety
- Visual / dramatic elements

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
