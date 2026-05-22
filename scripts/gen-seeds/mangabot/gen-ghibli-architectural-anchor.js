#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_architectural_anchor.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} ARCHITECTURAL ANCHOR entries for a MangaBot ghibli-countryside keyframe. Each entry is the PASTORAL STRUCTURE that anchors the scene. Unlike samurai-era (monumental towers) or neo-tokyo (megabuildings), Ghibli anchors are HUMAN-SCALE, intimate, weathered, lived-in.

Each entry: 12-22 words. ONE specific pastoral structure with material-truth detail.

ANCHOR VARIETY (rural-Japan pastoral structures):
- Thatched-roof cottage (kayabuki-yane, moss-flecked, weathered straw)
- Small wooden bridge (over stream, hand-built planks, iron-rust nails)
- Village shrine (small wooden jinja, paper-shimenawa, mossy stone-foundation)
- Stone well-house (well + small wooden roof, rope-hung bucket)
- Tea-house (wooden chashitsu in garden, tatami visible through shoji)
- Wooden windmill (rural water-mill or grain-mill, wooden blades)
- Hayloft barn (raised wooden barn, thatched-roof, ladder visible)
- Lantern-post (stone-toro lantern, mossy base, weathered carving)
- Shoji-screen veranda (engawa wooden porch with paper-screen wall)
- Wooden gate (rural village gate, no characters / signage)
- Stone-paved path (mountain pass road, mossy stones)
- Wagon / oxcart (wooden farm wagon at rest, no animal attached)
- Hand-pump (rural village water-pump, iron with wooden handle)
- Vegetable-stand (small wooden roadside produce-stand)
- Drying-shed (open wooden structure with hanging persimmons / herbs)
- Persimmon-tree house (cottage built around a great old persimmon tree)
- Bamboo-shed (small bamboo-walled outbuilding, woven texture)
- Wooden bath-house (rural village onsen, steam from chimney)
- Granary / rice-store (small raised wooden building on stilts)
- Stepping-stones (worn stones across a stream as path)

DO write:
- A weathered thatched-roof kayabuki cottage with moss-flecked straw and white-plaster walls, smoke curling from a clay chimney
- A small wooden bridge with hand-built planks spans a reedy stream, iron-rust nails visible, ferns at the abutments
- A village jinja shrine at the forest-edge, paper-shimenawa rope hung across the entrance, moss on the stone foundation
- A stone well-house with a small wooden roof, rope-hung wooden bucket beside it, ferns growing from the cracks
- A small wooden tea-house in a garden, tatami visible through partially-open shoji screens, lantern at the entrance
- A wooden hayloft barn raised on stilts, thatched-roof weathered grey, ladder leaning against one wall

DO NOT write:
- Monumental scale (those are samurai/neo-tokyo — Ghibli anchors are HUMAN-SCALE intimate)
- Urban / modern / industrial structures
- Multiple anchors per entry — ONE per entry
- Specific characters at the anchor (separate axis)
- Decorative props at scale (those are story_prop)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
