#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot cozy-interior scenes — tiny secondary details the eye finds AFTER the room + main creature.

Each entry: 12-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny secondary creature (sleepy cat curled on a stack of books / bird perched on a windowsill INSIDE / mouse peeking from a doorway / sleeping puppy curled on a rug / butterfly resting on a lamp)
- 20% steam / smoke / drift (steam from a teapot curling / smoke from incense / candle smoke ribbon / wisp of breath in cool air / dust motes drifting in beam)
- 15% reflection / light (warm-lamp puddle on hardwood floor / kettle-shine reflecting room / sun-square on the floor / candle-glow on a brass bedpost)
- 15% domestic-detail (open book face-down / half-finished knitting / forgotten slipper / abandoned spoon in sugar / hat hung on a hook)
- 10% magical-ambient (single firefly glowing inside / floating-mote of magical dust / glowing acorn on a shelf / wisp of will-o-wisp)
- 10% nature-indoor (single drifting feather / curling-leaf-on-a-windowsill / scrap of paper drifting / floating dandelion seed indoors / bee on a windowsill)
- 5% magical-artifact (key on a hook / wishing-stone on mantel / tiny crystal on windowsill / origami crane on a book)

━━━ HARD BANS ━━━

- NO main subject / hero creature
- NO outdoor / setting language
- NO time / weather / activity

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
