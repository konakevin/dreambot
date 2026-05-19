#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/heartwarming_surprise_elements.json',
  total: 150,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot heartwarming creature scenes — tiny secondary subjects, ambient details, or background life that proves there's a bigger picture-book world. The hero creature(s) are the main subject; the surprise element is the second-tier detail the eye finds AFTER the hero.

Each entry: 12-25 words. ONE specific surprise element with concrete visual detail.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Reads as a secondary detail (it's not THE subject — it's hiding in the corner, peeking through a gap, drifting past, distant background)
- Specific, picture-able, distinct from any creature pool
- Adds story or scale (proves the bigger world exists, gives the eye something to discover after the hero)
- Adorable / wholesome / curious — NEVER threatening

━━━ CATEGORY DISTRIBUTION ━━━
- 25% tiny background creature (sleeping baby bunny in a nest hole / mouse-family at a window / hedgehog dozing under a leaf / butterfly resting on a flower / dragonfly hovering / snail trail of sparkles / shy fox-kit peeking from a hollow)
- 20% magical ambient (glowing firefly drift / floating dandelion seeds / sparkles in the air / faint shooting star / soap bubble / will-o-wisp / dancing dust mote)
- 15% nature detail (curled fern / tiny wildflower cluster / dewdrop on a leaf / spiderweb caught in light / acorn / pinecone with a face / fallen petal)
- 15% interior detail (steaming teacup / open storybook on the floor / candle just lit / candy wrapper / yarn ball mid-unravel / kettle hissing / fresh-baked cookie crumbs)
- 10% travel/transient (paper boat floating by / hot-air balloon distant in sky / lone kite caught in a tree / bird-mail letter sliding under a door)
- 10% atmospheric drift (steam from a teacup curling up / smoke from a chimney / leaf falling slowly / petal drifting / snowflake catching light)
- 5% magical artifact (glowing key on a string / heart-shaped locket open / tiny crown on a pillow / wishbone propped against a window)

━━━ HARD BANS ━━━
- NO hero creatures (those are creature_1 / creature_2)
- NO activity verbs that imply main subject ("running" / "jumping" / "swimming")
- NO setting language (no "in the forest" / "at the cottage")
- NO time/weather

━━━ DEDUP ━━━
Dedup by: element type + concrete detail. "firefly drifting near the window" and "single firefly glow near a creature's shoulder" are duplicates.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
