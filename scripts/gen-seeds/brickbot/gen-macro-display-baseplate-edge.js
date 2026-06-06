#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_BASEPLATE_EDGE — the "this is a finished LEGO
 * diorama on a tabletop" signal at the build's margin. Audit 2026-06-05:
 * existing 16 entries — undersized. Target 200.
 *
 * Each entry describes the boundary treatment between the brick build and
 * the table — the AFOL convention-display "tabletop signal" that confirms
 * this is a complete display piece, not a real photograph.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_baseplate_edge.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} BASEPLATE-EDGE entries for BrickBot's macro-display path — the boundary treatment between the complete brick diorama and the tabletop, the AFOL convention-display "this is a finished LEGO build on a table" signal. Each entry is ONE 18-32 word sentence describing the edge treatment at the diorama's margin.

━━━ THE BAR ━━━
Every entry must read as a CONVENTION-DISPLAY signal — the deliberate, satisfying way the brick world meets the table edge. This is what tells the viewer "this is a finished LEGO MOC on display" (a charming feature, not a flaw). The treatment may be technical (visible studs, seams), landscaped (terrain tapering to baseplate), or formally presented (nameplate, tiled border, mirror-base).

━━━ VARIETY MANDATE (distribute roughly across these edge categories) ━━━
- ~5 BARE-STUD BASEPLATE — visible green / sand-tan / blue / grey / dark-bley stud-baseplate margin honestly framing the build
- ~4 LANDSCAPED FALLOFF — terrain (rock / grass / sand / snow / cobblestone / forest) tapering naturally to the baseplate rim
- ~4 FORMAL TILED BORDER — smooth tile frame around the build (dark-grey / black / white / brown) — clean picture-frame edge
- ~3 NAMEPLATE / TITLE-BRICK PLINTH — printed title-tile / engraved nameplate / convention-card at front edge of a display-base
- ~3 RETAINING-WALL EDGE — low brick / dark-grey / sandstone retaining wall ringing the diorama like a raised display-bed
- ~3 MULTI-BASEPLATE SEAM — visible 32x32 baseplate seams running through the build, modular construction honestly shown
- ~3 WATER-LIP / TRANS-PLATE EDGE — trans-blue water margin running to baseplate rim and stopping in a clean translucent boundary
- ~2 STEPPED-BRICK DROP — terrain descending in stair-step plate offsets to the baseplate
- ~2 MIRROR-BASE / REFLECTION-LIP — mirror surface beneath one edge doubling the build's margin downward (AFOL display trick)
- ~2 ROCKWORK CLIFF-EDGE — stacked slope-bricks forming a sheer plateau drop at the build's rim
- ~2 SLOPED-GRASS / SNOW FALLOFF — green / white slope-bricks tapering gently to bare baseplate
- ~2 DISPLAY-CASE PLINTH — clean black / white / wood-tile plinth elevating the build, gallery-museum presentation
- ~2 MIXED-BIOME SEAM — two baseplate colors meeting mid-build (green meets tan, blue meets grey) — biome-boundary edge
- ~1 DECORATIVE BORDER — checkered / dotted / printed-tile decorative frame, themed to the diorama
- ~1 STUDIO-SWEEP BACKDROP — diorama edge meeting a seamless white / black / blue curve at the back

━━━ FORMAT ━━━
Each entry: ONE 18-32 word sentence starting with "A" / "An" / a plural noun describing the edge feature. Touchpoint examples:
"A visible green stud-baseplate edge along the front, bare studs openly signalling the finished LEGO diorama sitting proudly on its table."
"A landscaped edge-falloff where terrain tapers naturally to bare baseplate studs at the margins, the world dissolving gently into the display-base."
"A black display-base with a printed title-brick at the front edge naming the diorama, the classic AFOL convention-presentation plinth beneath the build."
"A trans-blue water-edge lip where the build's lake runs to the baseplate margin and stops in a clean translucent-plate boundary, the water-world's edge."

━━━ BANS ━━━
- NO photoreal language — every edge is a brick / tile / studs / plate feature
- NO "blended seamlessly into the table" — the edge MUST be a deliberate brick / tile / nameplate / mirror / studio signal
- NO motion / animation language
- NO "as if floating" — the build sits on a tabletop display-base
- NO descriptive fluff — name the specific edge brick / tile / treatment

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
