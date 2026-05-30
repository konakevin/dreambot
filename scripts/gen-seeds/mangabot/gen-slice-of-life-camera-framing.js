#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for slice-of-life keyframe. Quiet intimate forward-facing or profile only. NO back-to-camera.

Each entry: 8-16 words. Framing + character orientation + everyday-mood composition.

DISTRIBUTION:
- 22% TIGHT MEDIUM (waist-up of character mid-action, face dominant in soft light)
- 18% FORWARD THREE-QUARTER (character angled 3/4 toward viewer mid-engaged-action)
- 14% CLOSE-UP CASUAL (face fills frame, single feature catches everyday light)
- 12% MEDIUM-FULL-BODY (35-50% frame with everyday setting wrapping)
- 10% PROFILE GENTLE (side-on profile mid-action, face visible)
- 8% LOW-ANGLE WARM (camera below; face turned slightly down at viewer with everyday lighting halo)
- 6% HIGH-ANGLE COZY (camera above; face turned up at viewer with quiet expression)
- 4% MEDIUM CROPPED (cropped at chest with face dominant)
- 4% DUTCH-ANGLE-CASUAL (tilted-frame casual mid-action toward viewer)
- 2% EXTREME CLOSE-UP (face fills frame, single eye in soft light)

DO write:
- Tight medium-shot, character waist-up mid-sip of coffee, face dominant in soft morning light
- Forward three-quarter, character at desk mid-write angled toward viewer, lamp-glow on face
- Close-up casual, character face fills frame mid-bite of pastry, focused expression
- Profile gentle mid-stir-of-pot at stove, side-on full silhouette with face in profile
- Low-angle warm, camera below character at bus-stop, face haloed by streetlight

DO NOT: over-shoulder behind / wide-vista with character-tiny / silhouette-from-behind. Photoreal camera specs.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
