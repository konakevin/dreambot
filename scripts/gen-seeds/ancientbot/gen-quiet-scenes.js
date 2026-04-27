#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/quiet_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} INTIMATE QUIET ANCIENT SCENE descriptions for AncientBot. Each entry is 25-40 words describing a specific small, warm, intimate corner of the ancient world. Pre-600 BC ONLY.

These are COZY and INTIMATE — the viewer should want to SIT DOWN in this space. NOT grand, NOT monumental — personal, warm, lived-in. The small human spaces tucked inside or alongside great civilizations.

━━━ SCENE TYPES (mix across ALL — wide variety is critical) ━━━
- Scribe's chamber (clay tablets stacked, bronze stylus, single oil lamp, cuneiform practice tablets, dried reed pens)
- Potter's workshop corner (kick-wheel, drying vessels on shelves, slip-stained hands, kiln warmth radiating)
- Tomb painting alcove (artist's pigment pots, half-finished wall painting, flickering lamp illuminating vivid figures)
- Catacomb/ossuary (carved niches, small offering vessels, ancient bones, quiet stone silence, single flame)
- Desert hermit shelter (simple mud-brick hut, woven reed mat, water jar, vast star-filled sky through doorway)
- Shepherd's camp on ancient trade route (wool blanket, small fire, bronze bell, sheep shapes in moonlight)
- Riverside fishing spot (reed boat pulled up on bank, woven fish trap, embers of cooking fire, river sounds)
- Rooftop at dusk (flat mud-brick roof, drying laundry, clay cooking pot, city sounds below, first stars)
- Abandoned shrine reclaimed by nature (wildflowers through cracked stone, weathered offering bowl, bird nesting in carved niche)
- Weaver's corner (vertical loom with half-finished textile, spindle whorls, dyed wool hanks, afternoon light through small window)
- Bronze-smith's alcove (small crucible, stone molds, finished jewelry pieces, charcoal glow)
- Healer's herb room (dried plants hanging from cedar beams, stone mortar, clay medicine vessels, earthy scent)
- Merchant's counting room (balance scales, stone weights, carnelian beads sorted by size, ledger tablet)
- Lookout post on city wall (guard's reed mat, water skin, bronze spear leaning on mudbrick, distant campfires)
- Child's sleeping corner (small woven mat, clay animal toy, oil lamp turned low, parent's loom nearby)

━━━ RULES ━━━
- Each entry is ONE specific intimate scene with civilization baked in (name the culture or city)
- SMALL SCALE — personal objects, single light source, close framing
- Include specific period-accurate OBJECTS that make it feel lived-in (clay tablets, bronze tools, linen, reed matting, ceramic vessels)
- Include warmth — a light source, a texture, a sense of human presence even if no humans shown
- 25-40 words each
- NO medieval, NO Greek/Roman, NO fantasy
- Wide variety — NOT all workshops, NOT all scribes, spread across all scene types

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
