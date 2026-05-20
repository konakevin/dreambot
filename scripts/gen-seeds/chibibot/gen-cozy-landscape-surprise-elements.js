#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_surprise_elements.json',
  total: 150,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot cozy-landscape scenes — tiny secondary subjects or ambient details the eye finds AFTER the wider world view. The world is the hero, the tiny resident is the focal point, the surprise element is the second-tier detail that proves the bigger cozy world exists.

Each entry: 12-25 words. ONE specific surprise element with concrete visual detail.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Reads as a secondary detail (peeking from a window, behind a tree, drifting past, hidden in a corner)
- Specific, picture-able, distinct from world-detail entries
- Adds story or scale (proves the bigger cozy world is alive)
- Adorable / wholesome / curious — NEVER threatening

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny background creature (mouse-family peeking from a doorway / butterfly resting on a flower / sleepy cat curled on a windowsill / bird-pair on a chimney / hedgehog dozing under a fern / squirrel mid-acorn-grab on a fence)
- 20% domestic-detail (laundry hanging on a line / open shutters / open window with curtain blowing / wreath on a door / sign on a market stall / hand-painted "OPEN" placard)
- 15% nature-detail (butterfly cloud above a meadow / dandelion-seed drift / fallen petal on a path / curling-fern by a doorway / single perfect daisy in a crack of cobblestone)
- 15% smoke / steam / atmospheric (smoke curling from a chimney / steam rising from a teapot on a windowsill / mist rising off a pond / chimney-smoke writing letters in the sky)
- 10% magical-ambient (single firefly drifting / glowing flower / floating dandelion / sparkle-trail / will-o-wisp peeking around a corner / wishing-petal in mid-air)
- 10% travel-transient (hot-air balloon distant in sky / paper boat sailing a puddle / kite caught on a chimney / pinwheel spinning in a window-box / mail-bird mid-delivery)
- 5% magical-artifact (glowing acorn half-buried / wishing-stone with carving / floating paper-lantern released / hidden door behind ivy / tiny crown on a fence-post)

━━━ HARD BANS ━━━

- NO main subject / hero creatures
- NO activity verbs implying the focal point
- NO setting language
- NO time/weather
- NO scary / sad / lost-creature

━━━ DEDUP ━━━

Dedup by: element type + concrete detail.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
