#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for rooftop-sunsets keyframe — STRICT forward-facing-or-profile only.

⚠️ THE ORIGINAL FAILURE PATH. Pool must aggressively counter "back-of-character looking at city" centroid.

Each 8-16 words. Framing + character orientation + composition cue.

DISTRIBUTION:
- 24% TIGHT MEDIUM (waist-up at rooftop mid-action, face dominant in sunset light)
- 18% FORWARD THREE-QUARTER (3/4 forward at rooftop mid-engaged-action)
- 14% CLOSE-UP SUNSET (face fills frame with sunset rim-light catching cheek)
- 12% LOW-ANGLE WARM (camera below; face haloed by sunset overhead, body engaged)
- 8% MEDIUM-FULL-BODY (35-50% frame with rooftop-prop in foreground, city as backdrop)
- 8% PROFILE-ENGAGED (side-on mid-action with rooftop-prop, face in profile not staring at horizon)
- 6% DUTCH-ANGLE-ROOFTOP (tilted-frame at rooftop mid-action toward viewer)
- 4% HIGH-ANGLE FROM-ABOVE (camera elevated; character face turned up at viewer)
- 4% PROP-FOREGROUND (rooftop-prop close to lens, character's face mid-distance focused on prop)
- 2% EXTREME CLOSE-UP (face fills with sunset glow)

DO write:
- Tight medium-shot, character waist-up mid-eat-bento at rooftop, face dominant in sunset glow
- Forward three-quarter, character at rooftop-grill mid-flip angled toward viewer, sunset light on face
- Close-up sunset, character face fills frame with peach-sunset rim-light catching cheek
- Low-angle warm, camera below character at rooftop, face haloed by golden-hour overhead
- Profile-engaged mid-strum guitar at rooftop, side-on full-body with face in profile not staring out

DO NOT — STRICT bans:
- Over-shoulder behind character — back-to-camera trap
- "Wide vista with character small against sunset-city" — back-to-character trap
- "Camera behind looking past character at city" — back-to-camera trap
- "Lone silhouette on rooftop against sunset" — back-to-camera trap
- "From behind the character looking out" — back-to-camera trap
- Photoreal camera specs

Forward-facing or profile-engaged ONLY.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
