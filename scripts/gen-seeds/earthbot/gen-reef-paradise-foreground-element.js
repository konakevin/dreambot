#!/usr/bin/env node
/**
 * EarthBot reef-paradise — FOREGROUND ELEMENT axis (R2 PIVOT).
 *
 * 30%-gated conditional. Optional foreground accent close to camera —
 * palm fronds arching in, lava rocks at frame-edge, hibiscus branch,
 * tiny distant silhouette. Adds depth without dominating.
 *
 * Small pool — 30 entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_foreground_element.json',
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ELEMENT entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic). 30%-gated conditional axis — fires only on some renders. Each entry describes ONE foreground accent close to camera that adds depth without dominating the bay view.

━━━ THE BAR — ONE TASTEFUL FOREGROUND ACCENT ━━━

A small element close to camera. Out-of-focus / soft-focus. Adds depth. Doesn't dominate or compete with the bay/shoreline/sky. Think postcard foreground framing — palm fronds arching in, a few lava rocks at the frame-edge, a single hibiscus branch.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one foreground element, 14-26 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **ONE FOREGROUND ELEMENT** (varied across entries):
   - "palm fronds arching in from the upper frame-corner"
   - "scattered lava rocks at the lower frame-edge"
   - "low palm-tree silhouette at the lateral frame-edge"
   - "a single hibiscus branch with a few visible blooms arching in from frame-edge"
   - "a few wave-worn lava boulders in the foreground"
   - "low-hanging coconut palm fronds visible in upper-corner"
   - "a thin sand-bar curving into frame at the lower edge"
   - "small palm cluster silhouette at lateral edge"
   - "tropical orchid branch arching in from upper frame-corner"
   - "scattered drift palm-frond on the water surface"

2. **A POSITION IN FRAME** (where it sits):
   - "upper frame-corner"
   - "lower frame-edge"
   - "lateral frame-edge"
   - "lower-corner of the frame"
   - "frame-edge framing the bay"

3. **A SOFT-FOCUS DESCRIPTOR** (so it doesn't compete):
   - "soft-focus close to camera"
   - "out-of-focus blur"
   - "softly silhouetted"
   - "in soft profile at the frame-edge"
   - "lightly silhouetted close to camera"

━━━ HARD BANS ━━━

NEVER include:
- Coral / fish / underwater wildlife
- Humans / boats / docks / structures / overwater bungalows
- Bay water (water_quality axis owns water)
- Sky (sky_drama axis)
- Camera / composition words
- Specific bay shape (bay_setting axis)
- Named places
- Large dominant subjects (must be SOFT-FOCUS / OUT-OF-FOCUS)

━━━ EXAMPLES ━━━

✓ "Palm fronds arching in from the upper-corner soft-focus close to camera, lightly silhouetted against the sky beyond"

✓ "Scattered lava rocks at the lower frame-edge in soft-focus blur, dark silhouettes framing the lower foreground"

✓ "A single hibiscus branch arching in from upper frame-corner with a few visible blooms, out-of-focus blur close to camera"

✓ "Low palm-tree silhouette at the lateral frame-edge in soft profile, silhouetted against the bright distance"

✓ "A thin curving sand-bar entering the lower-corner of the frame, soft-focus close to camera"

✓ "A few wave-worn lava boulders in the foreground at the lower edge, dark silhouettes in soft-focus blur"

✓ "Low-hanging coconut palm fronds visible in the upper-corner, softly silhouetted close to camera"

✓ "A tropical orchid branch arching in from upper frame-corner in soft-focus, a few visible blooms close to camera"

✓ "Drift palm-frond floating on the water surface in soft-focus close to camera at the lower edge"

✓ "Small palm cluster silhouette at the lateral frame-edge, lightly silhouetted close to camera framing the bay"

✗ BAD — coral: "Coral colony in foreground" (BANNED — coral identity is dead)
✗ BAD — humans: "Sunbather in foreground" (BANNED — zero humans)
✗ BAD — boats: "Sailboat in foreground" (BANNED — zero human-built features)
✗ BAD — dominant: "A massive palm tree filling the foreground" (BANNED — must be soft-focus / non-dominating)

━━━ DISTRIBUTION ━━━

- ~40% palm fronds in upper-corner
- ~25% lava rocks / boulders at lower-edge
- ~15% lateral palm silhouette
- ~10% flower branch (hibiscus / orchid)
- ~10% other (sand-bar / drift palm-frond / palm cluster)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. One soft-focus foreground accent per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
