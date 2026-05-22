#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA-FRAMING entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the SHOT TYPE. Painterly anime keyframe.

CRITICAL VARIETY MANDATE: do NOT default to vertical-pano / worm's-eye / wide-alley framings (those biased every render into the same center-vertical composition). Spread across very different framings.

Each entry: 8-16 words. Names the framing.

FRAMING DISTRIBUTION (no single mode above 16%):
- 16% DUTCH-ANGLE TENSION (tilted off-axis, pre-action energy)
- 14% HIGH-ANGLE DRONE-DOWN (camera looking down on figure + street)
- 12% PROFILE SIDE-ON (figure crosses frame in profile, NOT facing camera)
- 11% CLOSE-UP / FACE-FILLS-FRAME (intimate detail, signage blurred behind)
- 10% OVER-SHOULDER POV (camera behind figure, looking past at scene)
- 10% ASYMMETRIC OFF-CENTER (figure pushed to one side, weight unbalanced)
- 8% THROUGH-FOREGROUND-OBJECT (looking through chain-link / rain-streaks / window)
- 6% WIDE-ALLEY (kept but minority — used sparingly)
- 6% WORM'S-EYE LOW-ANGLE (kept but minority)
- 5% DOLLY-TRACKING SIDEWAYS (lateral motion, figure mid-motion across frame)
- 2% EXTREME TOP-DOWN BIRD'S-EYE (rare — overhead 90-degree-straight-down)

DO write:
- Dutch-angle tilted-frame composition, off-axis tension before something happens
- High-angle drone-down looking at the figure crossing a wet intersection, hovercar light-trails sweep across the frame
- Profile side-on composition, figure crosses the frame in profile, eyes forward not at camera
- Extreme close-up framing, face fills the frame, single cyber-eye catches a neon reflection
- Over-shoulder POV composition behind the figure, deep alley extending into vanishing point ahead
- Asymmetric off-center composition, figure pushed to bottom-left third, anchor dominates upper-right
- Through-rain-streaks composition, raindrops blur in foreground focus, figure soft-focus in midground
- Wide-alley cinematic framing (USED SPARINGLY), figure in mid-frame
- Worm's-eye low-angle (USED SPARINGLY), looking up at megabuilding face
- Dolly-tracking sideways composition, figure mid-motion, environment streaks past
- Bird's-eye top-down (RARE), straight-down 90-degree on figure in intersection

DO NOT write:
- Multiple "worm's-eye looking up at vertical megabuilding" — that's ONE entry max
- Multiple "wide cinematic alley with figure mid-frame" — ONE max
- Photoreal camera specs (f/stops / mm)
- Multiple shots per entry
- Modern handheld shaky-cam

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
