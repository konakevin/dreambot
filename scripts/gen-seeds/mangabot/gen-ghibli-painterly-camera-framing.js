#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for a MangaBot ghibli-painterly keyframe. Architecture is HERO at 50-70% of frame. NEVER hero-character close-up. NEVER tiny-anchor-in-distance Mt-Fuji-postcard.

Each entry: 12-20 words. ONE specific camera framing with explicit composition cue — must result in architecture-as-hero with scale provers visible.

FRAMING VARIETY (25 bespoke entries):
- 25% LOW-ANGLE HERO looking UP at the architecture (dramatic upward gaze)
- 20% VANISHING-POINT ASCENT through stair / corridor / arched portal
- 15% CATHEDRAL REVEAL through foliage portal (frame edges in foliage, anchor in center)
- 15% 3/4 ARCHITECTURAL ANGLE at midground reveal (slight birds-eye OR slight ground-eye)
- 10% OVER-FOREGROUND REVEAL (foreground prop / scale-prover in fg, anchor in mid-far)
- 10% THROUGH-ARCHWAY reveal (foreground arch frames the anchor beyond)
- 5% WIDE-ESTABLISHING (anchor at center, environment wrapping)

DO write:
- Low-angle hero looking up at the cathedral spire, foreground stones leading the eye, sky breaking around the peak
- Vanishing-point ascent up the central stair of the fortress, the anchor dominating the upper frame
- Cathedral reveal through a portal of cedar branches and ferns in the foreground edges, anchor center-frame
- 3/4 architectural angle at midground height, the anchor stretching from foreground stones to vanishing distance
- Over-foreground reveal — moss-stones and lanterns in close foreground, the floating fortress mid-distance
- Through-archway reveal — foreground torii gate frames the distant pagoda, perspective compressing depth
- Wide-establishing of the sky-island, the fortress dominant at center, cloud-sea wrapping the lower frame
- Low-angle hero gazing up through the foreground tree-canopy to the floating fortress above

DO NOT write:
- Hero-character close-up (this is SCENE-LED architecture path)
- Tiny architecture in distance (anchor MUST dominate)
- Photo-bombed character portrait
- Dutch angle / artistic-tilt without anchor mass
- Top-down birds-eye that flattens the anchor

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
