#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_camera_angles.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMERA ANGLE / SHOT FRAMING descriptions for ChibiBot — composition guides that frame cozy interiors and seasonal exteriors as paintings, not photos. 15-25 words each.

━━━ THE FORMULA ━━━
Each entry describes WHERE the camera is and HOW it sees the cozy scene. Lean toward INTIMATE framing (medium-wide is best for cozy — too tight loses context, too wide loses warmth).

━━━ SHOT CATEGORIES (distribute across ${n}) ━━━
- Medium-wide eye-level interior: the whole cozy room visible at relaxed eye level, no dramatic angle
- Through-frame compositions: shooting through a doorway / arch / between book-stacks / past a hanging plant — foreground frames middleground
- Window-side oblique: camera at an angle that frames both interior warmth and the window view in one composition
- Symmetrical / centered: Wes Anderson-style centered framing of a fireplace, bookshelf, or interior axis
- Low-angle from cushion-level: camera near the floor looking up into the warm room (cat's-eye-view of the cozy)
- High-angle looking down onto a desk / table / hearth: the cozy "still life" shot from above, surfaces packed with detail
- Behind-the-armchair: shot taken from behind a piece of furniture, looking past it INTO the warmth (you're in the room)
- Dust-mote backlight: composed so a single shaft of warm light cuts diagonally through the room with dust motes visible
- Streetside-looking-in: for seasonal-cozy exterior scenes — camera outside in the cold/dusk looking into a warm-lit window
- Snow-piled-window-side: camera framed past a snow-piled outer sill into a warm interior, mixing exterior cold + interior warmth

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. Camera position (eye-level / low / high / through-something / etc.)
2. Lens implied: medium-wide unless otherwise noted (no extreme-wide fish-eye, no extreme telephoto)
3. What's framed in foreground / midground / background
4. Mood word (intimate / serene / painterly / nostalgic / hushed)

━━━ HARD BANS ━━━
- NO selfie / portrait framing (no people)
- NO action / movement angles
- NO extreme tilt (Dutch angles feel anti-cozy)
- NO macro / extreme-close-up (loses room context)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Medium-wide eye-level interior, the whole cozy room visible from a relaxed standing height, painterly composition with warm lamp-pool centered"
EX-2: "Through-frame composition shot from a hallway through an open doorway into a warm interior beyond, foreground in shadow framing the bright cozy room"
EX-3: "Symmetrical centered framing of the stone fireplace, the mantel and clock at top of frame, hearth at bottom, vanishing-point on the back wall, Wes Anderson cozy"
EX-4: "Streetside view at twilight looking through a frost-edged window into a warm bookshop interior, snow piled on the sill, golden glow spilling onto the cold cobblestones"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
