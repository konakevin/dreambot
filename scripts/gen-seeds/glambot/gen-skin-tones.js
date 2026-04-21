#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/skin_tones.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SKIN TONE descriptions for GlamBot — explicit ethnic + fantasy spectrum. Wide diversity.

Each entry: 6-14 words. One specific skin tone with warmth/undertone note.

━━━ CATEGORIES ━━━
- Deep ebony with warm undertone
- Rich mahogany with red undertone
- Medium warm brown caramel
- Light warm-tan golden olive
- Fair porcelain with cool rose undertone
- Olive-neutral Mediterranean
- Warm golden honey skin
- Dark umber chocolate
- Light warm beige with peach undertone
- Medium cool pink-ivory
- Dark-cool blue-black undertone
- Warm cinnamon brown
- Warm-walnut brown
- Pale-cool porcelain blue-undertone
- Warm-peachy fair
- Medium-olive green-undertone
- Deep-espresso brown
- Sun-kissed bronze glow
- Golden-amber warm
- Rose-warm ivory
- Honey-warm medium
- Cool-mocha medium-dark
- Warm-hazel medium
- Pale-freckled cool
- Rich-sienna brown
- Deep-mocha red undertone
- Warm-caramel medium
- Pale-alabaster cool
- Warm-beige neutral
- Deep-cocoa warm
- Sun-tanned warm bronze
- Cool-ivory pink-undertone
- Fantasy-alien pale-lavender
- Fantasy-alien warm-mint
- Fantasy-alien pearlescent
- Fantasy-alien dusted-gold
- Fantasy-alien cool-blue
- Mixed-multi-tone (vitiligo beauty as art)
- Freckled-warm with copper freckles
- Freckled-cool with dark freckles
- Deep-onyx blue-undertone
- Warm-tawny medium
- Pale-peach warm-undertone
- Cool-taupe neutral-undertone

━━━ RULES ━━━
- Wide ethnic spectrum
- Include undertone (warm/cool/neutral)
- Fantasy spectrum included sparingly
- Respectful and specific

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
