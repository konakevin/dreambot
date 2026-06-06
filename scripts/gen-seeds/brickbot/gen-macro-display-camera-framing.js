#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_CAMERA_FRAMING — wide / pulled-back / whole-build
 * complete-diorama angles. Audit 2026-06-05: existing 12 entries — undersized.
 * Target 200. This path is the WHOLE-WORLD pulled-back convention masterpiece —
 * the framing must NEVER zoom into a single subject; it must ALWAYS show the
 * entire diorama edge-to-edge in deep focus.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's macro-display path — wide, pulled-back, COMPLETE-DIORAMA "behold the whole build" angles photographed at an AFOL LEGO convention. The whole tabletop world fits in frame — foreground to background, edge to edge, DEEP FOCUS throughout (no tilt-shift / no miniature blur). Each entry is one CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry must tell Flux exactly where to put the camera so the ENTIRE diorama is in frame — and why this angle reads as a convention-display photograph of a Best-of-Show MOC. The framing emphasizes COMPLETENESS, deep front-to-back layering, and edge-to-edge sharpness. Generic angles FAIL — name the camera height, angle, the baseplate edge, the depth direction.

━━━ VARIETY MANDATE (distribute roughly across these wide-establishing categories) ━━━
- ~4 HIGH-AERIAL / OVERHEAD-ANGLED — looking down across the entire build from above, every zone spread below
- ~3 EYE-LEVEL ALONG THE BASEPLATE — camera low at table-height raking the full build edge-to-edge, deep front-to-back layering
- ~3 CORNER-ESTABLISHING — camera planted at a build corner, two baseplate edges receding into frame, L-shaped extent
- ~3 TOP-DOWN PLAN — straight overhead, the build reading as a complete brick map
- ~3 HERO THREE-QUARTER WITH EDGE-BASEPLATE — classic convention angle, three-quarter from slightly above, front baseplate-edge + title-brick in frame
- ~2 DRAMATIC LOW WIDE — camera very low at one edge, foreground structures towering above, full build receding to far centerpiece
- ~2 DIAGONAL-CORNER-DEPTH — at one corner shooting the full diagonal, longest sightline threading every zone
- ~2 SLOW-ESTABLISHING WIDE PULL-BACK — fully pulled back, diorama + display-base centered with generous breathing room
- ~1 SYMMETRICAL DIRECT-FRONT WIDE — head-on at the full build, symmetrical zones spreading left/right
- ~1 DEEP-FOCUS LONG-SIDE PROFILE — viewed from a long-edge profile, the build's length reading like a panel
- ~1 BIRD'S-EYE THREE-QUARTER — high oblique angle, the build flattened slightly, all zones legible

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 words hyphenated), em-dash, 22-32 word body. Body MUST mention: camera height, angle, foreground/edge feature, and the FULL build's read. Touchpoint examples:
"HIGH-THREE-QUARTER AERIAL — camera high and angled down across the entire build, every zone spread below from foreground to deep background, the complete diorama masterplan legible."
"EYE-LEVEL ALONG-THE-BASEPLATE — camera low at table-height raking the full build edge-to-edge, deep front-to-back layering, the immersive walk-up convention read of the whole world."
"DEEP-FOCUS WIDE SWEEP — camera wide with the whole build tack-sharp edge-to-edge, every zone in crisp focus from foreground to deep background, the convention-display clarity, never blurred."

━━━ BANS ━━━
- NO close-up / single-subject framings — this path is COMPLETE-DIORAMA only
- NO "tilt-shift", "miniature blur", "shallow depth of field", "bokeh", "selective focus" — DEEP FOCUS only
- NO photoreal language — every entry is for a brick diorama
- NO centered single-figure portrait angles — the build is the subject, not any minifig
- NO motion blur language — render is static
- NO mood-vocab — name the angle precisely

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
