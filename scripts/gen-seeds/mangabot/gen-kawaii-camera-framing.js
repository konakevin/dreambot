#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for kawaii — forward-facing or profile-cute only. NO back-to-camera.

Each entry: 8-16 words. Framing + character orientation + cute composition.

DISTRIBUTION:
- 22% TIGHT MEDIUM (waist-up cute mid-action, face dominant)
- 18% FORWARD THREE-QUARTER (3/4 forward, body cute-engaged)
- 14% EXTREME CLOSE-UP (face fills frame, single dimple / sparkle-in-eye)
- 12% LOW-ANGLE CUTE (camera below, halo of sparkles overhead)
- 10% MEDIUM-FULL-BODY (35-50% frame, setting wraps)
- 8% PROFILE-CUTE (side-on mid-twirl with face in profile, hair caught)
- 6% DUTCH-ANGLE-CUTE (tilted-frame cute-energy at off-axis forward)
- 4% HIGH-ANGLE CUTE-DOWN (camera above; face turned up at camera with happy expression)
- 4% MAGIC-CIRCLE-FRAMED (heart-shaped frame wraps her face)
- 2% OVERHEAD-CUTE (90-degree overhead with face turned up at camera)

DO write:
- Tight medium-shot, kawaii girl waist-up mid-laugh, face dominant in pastel glow
- Forward three-quarter cute, character angled toward viewer mid-twirl, sparkle trail
- Extreme close-up, kawaii face fills frame, single dimple catches starlight
- Low-angle cute, camera below girl with sparkle-halo overhead, face brightly engaged
- Profile cute mid-twirl side-on, full-body with skirt caught mid-arc, face visible in profile

DO NOT: over-shoulder behind / wide-vista-with-girl-tiny / silhouette-from-behind. Photoreal camera specs.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
