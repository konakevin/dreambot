#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_eyes.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EYE-COLOR-AND-INTENSITY entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (10-18 words) describing the EXACT vivid color of warrior eyes AND how fantasy-world light interacts with them — torchlight glint, firelight catch, dragon-flame reflection, moonlight bounce.

This pool composes with separate skin/hair/outfit pools. Eyes should feel POWERFUL — power, focus, weariness from countless battles. Suitable for both male and female.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- AMBER / GOLD (4-5) — molten amber catching torchlight to liquid gold, warm honey-amber with copper rings around the pupil, dark amber that glints brass when she turns her head, dragon-gold eyes burning under flame, antique-bronze gold with darker outer rim
- GREEN (4-5) — forest-green so vivid they look lit from within, deep moss-green softened by lantern warmth, cold serpent-green catching firelight, hazel-green that goes brass when fires rise, sage-green with gold flecks
- BLUE (4-5) — Northern ice-blue burning cold under torchlight, deep ocean-blue with a haunted pale ring, glacier-blue glinting silver under moonlight, electric-blue that crackles when focused on the kill, weathered grey-blue washed warm by lantern
- BROWN / UMBER (4-5) — chocolate-brown with copper highlights from the forge-banner, dark almond-brown that catches torchlight to warm honey, deep umber going gold near the iris-edge, rich coffee-brown with bronze flecks, mahogany-brown glinting copper under firelight
- RARE / STRIKING (4-5) — heterochromatic one amber one storm-grey, blood-red eyes from old curse-magic, violet-tinged grey going amethyst at dusk, dragon-flame yellow with vertical pupils inherited from ancestor-bond, smoke-grey with brass specks

━━━ RULES ━━━
- Each entry is a VIVID color + a fantasy-light interaction
- Color-diverse — do NOT cluster on amber
- Eyes should feel POWERFUL — focused, weathered, intentional
- One entry MUST involve dragon-bond or curse-magic (signature DragonBot detail)
- Suitable for both male and female warriors
- No "soulless" / "dead eyes" / horror-coded — power and danger via VIVIDNESS

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
