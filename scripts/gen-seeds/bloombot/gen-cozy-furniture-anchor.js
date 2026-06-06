#!/usr/bin/env node
/**
 * BLOOMBOT_COZY_FURNITURE_ANCHOR — heavy hand-crafted central furniture
 * piece anchoring a cozy bloom-filled interior. Wicker settee with faded
 * cushions, cast-iron dutch oven on trivet, pine writing desk with
 * ink-bottle, iron-frame bed, ladder-back chair, brass watering can, oak
 * blanket chest, phonograph with flared horn.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_cozy_furniture_anchor.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} FURNITURE ANCHOR entries for BloomBot's cozy path — a single hand-crafted hero furniture piece that anchors a flower-filled cottage / cabin / nook interior. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing the piece, its material, its weathered character, and one or two small qualifiers (a cushion, a draped throw, a brass detail).

━━━ THE BAR ━━━
Every entry names a SPECIFIC hand-crafted, hand-worn furniture/object hero. Each must have: a clear archetype (settee, dutch oven, writing desk, bed, chair, watering can, blanket chest, phonograph, etc.) + a specific material (cast-iron, pine, wicker, brass, oak, leather, wrought-iron) + a small lived-in detail (faded cushion, ink-stain, embroidered pillowcase, worn rush seat). Reads as something you could photograph from a Frenchpox / English cottage / New England farmhouse interior.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"WICKER SETTEE WITH FADED CUSHIONS — woven wicker two-seat settee with sagging seat-cushions in faded blue ticking stripe, a crocheted blanket folded over one arm, a worn footstool pulled close beneath"
"CAST-IRON DUTCH OVEN ON TRIVET — heavy cast-iron dutch oven resting on a wrought-iron trivet, lid slightly ajar, the black surface seasoned deep with years of use, a folded linen cloth beside"
"PINE WRITING DESK WITH INK-BOTTLE — knotted pine writing desk with a brass-cornered blotter, a tipped ink-bottle leaving a faint ring, a stack of envelopes tied with brown twine, small brass drawer-pulls"
"IRON-FRAME BED WITH LINEN SHEETS — slender black iron-frame bed with brass ball finials, crumpled unironed linen sheets in pale oat-white, a folded wool blanket at the foot, embroidered pillowcase at the head"
"LADDER-BACK CHAIR WITH RUSH SEAT — tall ladder-back chair with a hand-woven rush seat worn soft at the centre, a folded patchwork cushion tied to the back rail with faded ribbon"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 SEATING (wicker settee, ladder-back chair, leather wingback, painted rocker, three-legged stool, padded bench, deacon's bench, deep window-seat)
- ~5 BED / SLEEP (iron-frame bed, four-poster, daybed, brass-railed crib, painted child's bed, sleigh bed, cushioned daybed)
- ~4 DESK / WRITING (pine writing desk, oak roll-top, painted secretary, slant-top desk, drafting table, tin-clad writing slope)
- ~3 STORAGE (oak blanket chest, painted dowry-chest, pine apothecary cabinet, weathered steamer-trunk, wardrobe with brass keyhole, dovetailed pantry)
- ~3 KITCHEN HEARTH (cast-iron dutch oven, copper kettle on hob, wood-fired range, butcher-block table, slate-topped pastry table, hanging pot-rack)
- ~3 SHELVING / DISPLAY (wall-mounted plate rack, ladder-style bookshelf, mismatched stacked crates, glass-fronted hutch, pine plate dresser)
- ~3 TABLE (rustic farm table, painted breakfast nook, pine drop-leaf, tea table with porcelain top, weathered console)
- ~2 LIGHT-CARRYING OBJECT (kerosene lamp on side-table, brass candelabra on chest, paper-lantern on hook, tin lantern by door)
- ~2 GARDENING TOOL (brass watering-can, copper potting basin, hand-trowel set in basket, terracotta planter row)
- ~2 SOUND OBJECT (phonograph with flared horn, upright piano, music-box on doily, harmonium against wall)
- ~2 TEXTILE FOCAL (treadle sewing machine, vintage spinning wheel, embroidery frame on stand)
- ~3 WALL OBJECT (carved mantel above hearth, oval mirror with gilt frame, brass-clad clock, plate-rail along plaster, pegboard with hung herbs)
- ~3 SMALL HERO OBJECT (brass watering-can on sill, hand-carved cradle, painted dollhouse, weather-beaten wash-board, foot-pedal grindstone)

━━━ BANS ━━━
- NO photographer-name drops.
- NO modern electronics (no TVs, no phones, no LEDs).
- NO bare "old chair" — name the WOOD / METAL / WEAVE / FINISH + the specific archetype.
- NO action — the piece is STATIC at rest, with at most ONE small soft detail beside it.
- NO people, no hands.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming the archetype + material + weathered finish + one or two small lived-in details".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
