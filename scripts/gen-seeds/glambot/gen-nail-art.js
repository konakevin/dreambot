#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/nail_art.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} NAIL ART descriptions for GlamBot's nail-and-hand path — viral manicure art + ring-stacking concepts.

Each entry: 10-20 words. One specific nail art + optional jewelry detail.

━━━ CATEGORIES ━━━
- French-tip chromatic (iridescent white tips)
- Rhinestone-encrusted almond nails
- Mirror-chrome polish (liquid-metal reflection)
- Holographic glitter
- Milky-white long stiletto with gold charms
- Abstract-art hand-painted nails
- 3D-sculpted nails (tiny charms protruding)
- Cat-eye magnetic polish
- Velvet powder matte finish
- Ombre neon gradient
- Pearl-embedded coffin nails
- Chrome-french with jewel accents
- Swarovski-crystal fully-encrusted
- Glass-nail transparent with embedded flowers
- Graffiti-style painted nails
- Marble-swirl polish
- Jelly-polish translucent colored
- Lace-pattern decal nails
- Solar-system art nails (planets)
- Zodiac-symbol nails
- Hello-Kitty-style character nails
- Black-glossy pointed witchy
- Foil-ripped effect nails
- Snakeskin-pattern nails
- Leopard-print chromatic
- Fire-flame gradient
- Butterfly-wing translucent
- Hologram-starburst
- Nail-charm hanging (dangly charms)
- Stiletto-gold-tip classic
- Bubble-gum pink matte coffin
- Forest-emerald jewel nails
- Velvet-red matte almond
- Pearl-drop manicure (pearl glued)
- Multi-length-squoval nail-art
- Mood-changing-color nails
- Denim-texture blue nails
- Gingham-check pastel nails
- Watercolor-wash nails
- Moon-phase nails
- Artistic-drip paint-nails
- Ring stacking: stacked-gold-knuckle-bands
- Ring stacking: vintage-cocktail-ring cluster
- Ring stacking: silver + pearl mixed
- Ring stacking: double-finger-chain-connected
- Ring stacking: armor-style knuckle-to-first-joint
- Ring stacking: pinky-ring + signet stacks
- Ring stacking: rose-gold delicate multi
- Ring stacking: heavy chunky statement-rings

━━━ RULES ━━━
- Viral manicure art
- Include ring-stacking options
- High-fashion editorial

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
