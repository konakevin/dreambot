#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/camera_angles.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `Write ${n} camera-angle / lens / framing descriptors for toy-photography dioramas. Each entry = ONE specific camera setup (angle + framing + optional lens cue), written as comma-separated phrases. 8-18 words per entry.

━━━ HARD ANTI-BIAS RULES ━━━
- MAX 10% straight-on / eye-level / front-facing (Sonnet's default — keep restrained).
- VARIETY across angle + framing + lens.
- Mix dramatic + practical + unconventional.

━━━ ANGLES TO ROTATE ━━━
- low-angle hero shot looking up at toys
- worm's-eye floor-level dust-cam
- high-angle bird's-eye overhead diorama
- dutch-tilt diagonal
- 3/4 angle from above
- 3/4 angle from below
- canted-angle dynamic
- profile / side-view tracking shot
- over-the-shoulder behind one toy
- wide-establishing two-thirds-on diorama
- macro extreme close
- through-the-legs forced-perspective
- between-objects POV
- crane-shot pulling-back
- spinning-circle around-the-action
- mirror / reflection composite angle
- forced-perspective tiny-toy-loomed-large
- top-down isometric layout
- toy-eye-level natural
- knee-of-toy looking-up
- ground-level dust-streaked
- helicopter aerial 90-degree-down
- snorricam / strapped-to-action shot
- trunk-of-vehicle POV
- side-angle racing-track-pan
- low-tilt up-from-puddle
- silhouette-against-light backlight composition
- two-thirds-overhead 3D-perspective
- corner-room-perspective wide
- vanishing-point forced-depth
- foreground-toy-blur background-action-sharp
- background-toy-blur foreground-detail-sharp

━━━ FRAMING ━━━
Mix wide / medium / close. Include cinematic lens cues like "anamorphic", "1.85:1 widescreen", "2.39:1 cinemascope", "shallow-DOF", "deep-focus", "fisheye", "telephoto-compression", "wide-90mm", "macro-100mm".

━━━ FORMAT ━━━
Each entry: 8-18 words, comma-separated phrases, written as direct camera direction:
- "low-angle hero shot looking up, wide-90mm, deep-focus, two-thirds visible, dramatic chrome highlights catch overhead light"
- "worm's-eye floor-level dust-cam, 2.39:1 cinemascope, foreground silhouettes blurred, midground sharp, distant dust-cloud trailing"
- "high-angle bird's-eye 75-degrees-down, deep-focus diorama-overview, all subjects clearly separated, even spacing across frame"
- "canted dutch-tilt 15-degrees, telephoto-compression, foreground-action sharp, background-bokeh swirling, dynamic-tension composition"

━━━ BANNED ━━━
- Generic "cinematic" without specifying angle/framing/lens
- Identical entries
- Pure narrative without camera direction

━━━ DEDUP RULE ━━━
- No two entries share ANGLE-TYPE + FRAMING + LENS combo exactly.
- Vary across the ${n} entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
