#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_camera_framing.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for post-apocalyptic keyframe — STRICT forward-facing-or-profile only.

⚠️ THIS GENRE'S SIGNATURE FAILURE MODE = "back-of-lone-wanderer-on-cliff-looking-at-ruined-city-on-horizon." Every camera entry must AGGRESSIVELY counter that centroid. NO over-the-shoulder away-from-camera, NO silhouette-against-horizon, NO back-of-character.

Each 8-16 words. Framing + character orientation + composition cue.

DISTRIBUTION:
- 24% TIGHT MEDIUM (waist-up mid-scavenge-action, face dominant in dust-amber light)
- 18% FORWARD THREE-QUARTER (3/4 forward facing camera mid-engaged-action with ruin-prop)
- 14% CLOSE-UP DUSTY (face fills frame with dust-streak on cheek, low-amber rim-light)
- 12% LOW-ANGLE HEROIC (camera below, face haloed by sky-shaft overhead, body engaged at prop)
- 10% OVER-THE-SHOULDER TOWARD-PROP (camera behind-AND-ABOVE wanderer looking DOWN at what they're examining — face mostly visible)
- 8% MEDIUM-FULL-BODY (35-50% frame with ruin-prop in foreground, wanderer ENGAGED, vista as backdrop NOT focus)
- 6% PROFILE-ENGAGED (side-on mid-action with ruin-prop, face in profile NOT looking at horizon)
- 4% DUTCH-ANGLE-RUIN (tilted-frame at wanderer mid-action toward viewer)
- 2% HIGH-ANGLE FROM-ABOVE (camera elevated; wanderer's face turned up at viewer)
- 2% PROP-FOREGROUND (ruin-prop close to lens, wanderer's face mid-distance focused on prop)

DO write:
- Tight medium-shot, wanderer waist-up mid-pry-panel, face dominant in dust-amber light
- Forward three-quarter, wanderer at rusted-engine mid-wrench-turn angled toward viewer, sky-shaft on face
- Close-up dusty, wanderer's face fills frame with dust-streak on cheek and low-amber rim
- Low-angle heroic, camera below wanderer mid-stride forward, face haloed by overcast-sky shaft
- Over-the-shoulder toward-the-map, camera behind-and-above wanderer looking down at map on knee, face mostly visible in profile
- Profile-engaged mid-strike-flint at lantern, side-on full-body with face in profile not staring out
- High-angle from-above, camera elevated above wanderer crouched at ruin-prop, face turned up at viewer

DO NOT — STRICT bans:
- "Over-the-shoulder behind character looking at distant ruins" — back-to-camera trap
- "Wide vista with character small against ruined-city horizon" — back-to-camera trap
- "Camera behind looking past character at desolate landscape" — back-to-camera trap
- "Lone silhouette on cliff against sunset" — back-to-camera trap
- "From behind the wanderer looking out at the wasteland" — back-to-camera trap
- "Walking away from camera into the distance" — back-to-camera trap
- Photoreal camera-spec language

Forward-facing or profile-engaged ONLY. Ruins are BACKDROP, wanderer is ENGAGED with foreground.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
