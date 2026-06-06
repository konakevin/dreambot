#!/usr/bin/env node
/**
 * BLOOMBOT_COZY_INTERIOR_SETTING — overall room/interior setting for the
 * cozy path. Sunroom wicker corner, breakfast nook, writing desk under
 * leaded panes, arched window reading seat, attic dormer, carved
 * stairwell landing, kitchen copper corner, fireside leather armchair
 * room.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_cozy_interior_setting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} INTERIOR SETTING entries for BloomBot's cozy path — a full WIDE cottage / cabin / nook interior that frames a flower-filled cozy scene. Each entry is one descriptive line, 30-50 words, starting with a CAPS NAME, em-dash, then body describing the room type, architectural features, windows, floor, walls, and one or two anchoring details.

━━━ THE BAR ━━━
Every entry names a SPECIFIC ROOM-SCALE setting that reads as Pinterest-cozy / English-cottage / New-England-farmhouse / French-countryside / Scandi-cabin interior. Each must have: a clear room TYPE (sunroom / breakfast nook / library corner / window-seat / attic dormer / kitchen / stairwell landing / fireside parlour / pantry / mudroom / conservatory edge) + ARCHITECTURAL features (leaded glass, plank floor, beadboard wall, stone arch, brass coat-hooks) + a single anchoring hero or two (window-seat, breakfast bench, leather armchair, brass coat-hooks, mantelpiece).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"SUNROOM WICKER CORNER — white wicker daybed with ticking-stripe cushions in a glass-corner sunroom, terracotta floor tiles sun-warmed, hanging basket overhead, tall multi-pane windows fogged with morning mist"
"BREAKFAST NOOK WITH HONEY JAR — cushioned bench tucked into a leaded-glass bay window, checkered cloth with a china teapot, sticky honey-jar, and crumb-dusted plate, faded daisy wallpaper visible at the edges"
"WRITING DESK UNDER LEADED PANES — wooden writing desk beneath a tall leaded-glass window, brass candlestick burning low, open leather journal with ink-blotted pages, scattered correspondence, a spent quill"
"ARCHED WINDOW READING SEAT — deep window-seat set into a stone arch, cushion-pile and a folded quilt in faded indigo, leaded glass throwing diamond shadows, a stack of weathered paperbacks beside a small ceramic mug"
"ATTIC DORMER WITH BRASS HOOKS — slope-ceiling attic room with a small dormer window and a square skylight above, brass coat-hooks hung with dried herb bundles, leather steamer-trunk, wide-plank floor"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 SUNROOM / CONSERVATORY EDGE (wicker corner, glass-and-iron porch, glassed-in breakfast room, garden room with stone tile)
- ~3 BREAKFAST NOOK (bay-window bench, painted alcove bench, banquette under leaded glass, corner banquette with wallpaper)
- ~3 WRITING / READING NOOK (desk under window, library armchair corner, reading-seat in arch, window-seat with pillows, drafting corner)
- ~3 BEDROOM (iron-frame bed at dormer, four-poster in attic, painted child's room, garret bed at gable, sleigh-bed nook)
- ~3 KITCHEN (copper-pan kitchen corner, slate-counter pastry corner, dutch oven hearth, painted plate cupboard wall, butler's pantry)
- ~3 FIRESIDE / PARLOR (leather wingback parlour, hearth-side wingback, stone-fireplace nook, painted-mantel parlour, brick fireplace alcove)
- ~3 ATTIC / GARRET (dormer-window attic, sloped-ceiling guest room, gable bedroom, attic studio under skylight)
- ~3 PANTRY / MUDROOM / ENTRY (mud-room hooks, beadboard pantry, stone-flagged entry hall, vestibule with carved bench)
- ~3 LANDING / STAIR (carved stairwell landing, attic-stair turn, half-landing with window, mezzanine reading shelf)
- ~3 WORKROOM (sewing nook by window, painter's studio corner, potting-shed corner, herb-drying loft)
- ~3 BATH (claw-foot tub by window, beadboard bath nook, garden bath alcove, wood-walled shower corner)
- ~3 NURSERY / CHILD'S ROOM (cradle-side nook, painted toy-shelf corner, dollhouse alcove, child's window-seat)
- ~3 DINING (farm-table dining room, painted breakfast room, slate-floor dining corner, bay-window dining nook)
- ~3 ALCOVE / NOOK (built-in book nook, stone alcove with cushion, fireplace inglenook, panel-built daybed nook)

━━━ BANS ━━━
- NO modern electronics (no TVs, no phones, no LED).
- NO people, no figures.
- NO photographer-name drops.
- NO sterile-modern aesthetic — these are warm, wood, brass, linen, ceramic, soft-faded.
- NO bare "cozy room" — name the ROOM TYPE + architecture + anchoring feature.

━━━ FORMAT ━━━
Each entry: 30-50 words. Format: "NAME CAPS — body text naming room type + architectural feature + one or two anchoring details + window/light qualifier".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
