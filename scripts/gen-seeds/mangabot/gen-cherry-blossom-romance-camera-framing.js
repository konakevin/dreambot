#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_camera_framing.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for romance keyframe — tender intimate forward-facing or profile only.

Each 8-16 words. Framing + character orientation + tender mood.

DISTRIBUTION:
- 22% TIGHT MEDIUM (waist-up tender mid-action, face dominant)
- 18% FORWARD THREE-QUARTER (3/4 forward tender pose)
- 14% CLOSE-UP TENDER (face fills frame, single dimple / petal-on-cheek)
- 12% LOW-ANGLE WARM (camera below, face haloed by sakura overhead)
- 10% PROFILE TENDER (side-on profile mid-tender-moment, hair caught by breeze)
- 8% MEDIUM-FULL-BODY (35-50% frame with cherry-tree wrapping)
- 6% HIGH-ANGLE COZY (camera above; face up at viewer with tender expression)
- 4% EXTREME CLOSE-UP (face fills with petal-on-eyelash)
- 4% DUTCH-ANGLE-TENDER (tilted-frame tender mid-action toward viewer)
- 2% CROPPED-WAIST (cropped at waist with face dominant)

DO write:
- Tight medium-shot, character waist-up mid-blush, face dominant in pink-amber sakura light
- Forward three-quarter, character at bench mid-write angled toward viewer, petals catching hair
- Close-up tender, character face fills frame with single cherry-petal on cheek
- Low-angle warm, camera below character under sakura, face haloed by petal-cascade
- Profile tender mid-walk side-on, full silhouette with petals trailing motion

DO NOT: over-shoulder behind / wide-vista-with-character-tiny / silhouette-from-behind. Photoreal camera specs.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
