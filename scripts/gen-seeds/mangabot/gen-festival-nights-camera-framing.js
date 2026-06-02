#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for festival-nights keyframe — forward-facing engaged matsuri-moment ONLY. Each 8-16 words. Framing + character orientation + lantern-warm mood.

⚠️ CRITICAL: NEVER "wide silhouette under fireworks", NEVER "back-view watching display", NEVER "over-shoulder behind staring up at sky". This IS the failure mode. Camera engages with the face.

DISTRIBUTION:
- 22% TIGHT MEDIUM (waist-up mid-action with face dominant in lantern-amber light)
- 18% FORWARD THREE-QUARTER (3/4 forward engaged-pose with stall or partner)
- 14% OVER-SHOULDER TOWARD STALL (over-character's-shoulder INTO yatai counter — vendor and food visible across counter, character's hair-side-of-face visible)
- 12% LOW-ANGLE HERO WITH LANTERNS (camera below, face haloed by chochin-string overhead, lanterns framing top of frame)
- 10% CLOSE-UP MATSURI (face fills frame with sparkler-glow on cheek / lantern-reflection in eye)
- 8% PROFILE ENGAGED (side-on profile mid-engaged-action with face visible in profile not back)
- 6% MEDIUM-FULL-BODY-AT-STALL (35-50% frame with stall-front wrapping)
- 4% HIGH-ANGLE COZY-INTO-FACE (camera above; face up at viewer with festival-glow)
- 4% EXTREME CLOSE-UP (face fills with single sparkler-spark on cheek / takoyaki on lip)
- 2% DUTCH-ANGLE-MATSURI (tilted-frame mid-laugh toward viewer)

DO write:
- Tight medium-shot, character waist-up mid-bite-takoyaki with face dominant in lantern-amber light
- Forward three-quarter, character at yatai-counter mid-order angled toward viewer-side
- Over-shoulder toward takoyaki-stall, vendor across counter mid-flip, character's hair-side-of-face visible at edge
- Low-angle hero with chochin-string overhead, face haloed by warm-amber lantern-glow
- Close-up matsuri, character face fills frame with senko-hanabi sparkler-glow on cheek
- Profile engaged mid-walk through stall-row, full silhouette with face-side visible in 3/4 profile
- Medium-full-body at kingyo-sukui tank, character mid-scoop with paper-poi paddle wrapped by stall
- High-angle into face from above, character looking up at viewer with festival-glow on cheek
- Extreme close-up, single sparkler-spark on cheek with eye-glow visible
- Dutch-angle mid-laugh toward viewer, lanterns blurred behind face

DO NOT: "wide vista with character tiny under fireworks" / "back-view silhouette under hanabi" / "from-behind admiring sky" / "over-shoulder behind character watching display" — back-to-camera traps. Photoreal camera specs.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
