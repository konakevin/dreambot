#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_male_eye_colors.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} EYE-COLOR-AND-INTENSITY entries for GothBot's goth-male-closeup and goth-male-full-body paths. Each entry is a SHORT phrase (10-18 words) describing the EXACT vivid color of his eyes AND how gothic-world light interacts with them — candle-glow, moonlight catch, lantern-flicker, blood-light bounce.

This pool composes with separate skin/hair/wardrobe/accessory pools. The eyes should feel SUPERNATURALLY VIVID — power and centuries radiating outward.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- AMBER / GOLD (4-5) — molten amber catching candle-glow, deep honey-gold with darker outer ring, brass-flecked amber burning under lantern, antique-gold with copper striations, warm whiskey-amber going luminous in shadow
- GREEN (4-5) — absinthe-green so vivid they look lit from within, deep moss-green softened by candlelight, cold serpent-green catching moonlight, hazel-green flecked gold, blackened-emerald with violet undertones
- BLUE (4-5) — ice-blue burning cold under candle, deep ocean-blue with a haunted pale ring, crystal-blue glinting silver under moonlight, ancient ash-blue washed warm by lantern, electric-blue when he's focused
- BROWN / UMBER (4-5) — chocolate-brown with red-wine highlights, dark almond-brown going gold near the iris-edge, deep umber catching candle to honey, rich coffee-brown with mahogany flecks, blood-warm brown glinting copper
- RARE / STRIKING (4-5) — heterochromatic one amber one ice-blue, blood-red eyes that drink light, violet-tinged grey going amethyst at dusk, washed-pale ghost-grey, smoke-grey with silver flecks, single supernatural glow where one eye should be normal

━━━ RULES ━━━
- Each entry is a VIVID color + a gothic-light interaction
- Color-diverse — do NOT cluster on amber. Hit every tier
- Eyes should feel POWERFUL and ancient — they radiate, they pierce
- Masculine register — power, menace, authority, weariness — NOT pretty/soft
- One entry MUST include "blood-red" or similar dark-supernatural variant
- No "soulless" / "dead eyes" / shock-horror — power and danger via VIVIDNESS

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
