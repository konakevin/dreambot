#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_camera_framing.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for BEACH-EPISODE keyframe — bright joyful summer-vacation FORWARD-FACING ONLY.

⚠️ ANTI-BACK-TO-CAMERA: no "back-to-viewer at shoreline" / no "silhouette-from-behind facing ocean" / no "over-shoulder gazing at horizon".
⚠️ ANTI-CHEESECAKE: no "low-angle from feet up legs" / no "tracking-down-the-body" / no "lingering-on-curves" — wholesome framings only.

Each 8-16 words. Framing + character orientation + bright joyful mood.

DISTRIBUTION:
- 22% TIGHT MEDIUM (waist-up mid-action with face dominant)
- 18% FORWARD THREE-QUARTER (3/4 forward bright pose, beach-activity TOWARD viewer)
- 14% LOW-ANGLE HERO (camera below at sand-level, character heroic-bright with sky behind)
- 12% MEDIUM-FULL-BODY (35-50% frame with beach-activity wrapping)
- 10% CLOSE-UP JOYFUL (face fills frame mid-laugh / shaved-ice cheek / sun-glint-eyes)
- 8% OVER-SHOULDER TOWARD-ACTIVITY (camera at angle TOWARD beach-activity / cresting-wave / sand-castle)
- 6% PROFILE-IN-MOTION (full profile mid-action with sand-trail / spray-trail visible)
- 4% HIGH-ANGLE PLAYFUL (camera above looking down at sand-play, face up at viewer beaming)
- 4% DUTCH-ANGLE-ENERGY (tilted-frame mid-jump or mid-splash toward viewer)
- 2% EXTREME CLOSE-UP (face fills with sand-grain on cheek / sunscreen-dab / smile)

DO write:
- Tight medium-shot, character waist-up mid-laugh, face dominant in bright sun-amber light
- Forward three-quarter at sand-castle bucket angled toward viewer, hands at work
- Low-angle hero at sand-level, character standing with surfboard sky behind, bright clouds
- Medium-full-body mid-volleyball spike facing camera, sand kicking up at feet
- Close-up joyful, character face fills mid-laugh with shaved-ice on cheek
- Over-shoulder TOWARD cresting-wave with character mid-paddle on board face-visible
- Profile-in-motion mid-run on wet sand with spray-trail behind, full silhouette joyful
- High-angle playful from above at sand-castle, character looking up at viewer beaming
- Dutch-angle-energy mid-splash with arms-spread toward viewer, water mid-arc
- Extreme close-up face fills with single sand-grain on freckled cheek, smile dawning

DO NOT: over-shoulder behind-character-facing-away / silhouette-from-behind / wide-vista-with-character-tiny / low-angle-up-the-body / tracking-curves / photoreal-camera-specs. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
