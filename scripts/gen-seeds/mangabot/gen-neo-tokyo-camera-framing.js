#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the SHOT TYPE. Painterly anime keyframe.

⚠️ NEVER write "back-of-character looking out at scene" framings. The audit on 2026-05-29 found 12% of this pool was over-shoulder / "figure tiny against megabuilding" / "eyes forward NOT at camera" — that compounded into homogenous back-to-camera renders. Recipe rewritten 2026-05-29 to PURGE those framings.

Each entry: 8-16 words. Names the framing.

FRAMING DISTRIBUTION (no single mode above 18%; ALL forward-facing-or-profile):
- 18% DUTCH-ANGLE TENSION (tilted off-axis pre-action; figure angled toward viewer or in profile)
- 14% HIGH-ANGLE DRONE-DOWN (camera looking down on figure; figure face turned up at something, NOT back-of-head)
- 14% PROFILE SIDE-ON (figure crosses frame in profile, face visible in profile, body engaged mid-motion)
- 12% CLOSE-UP / FACE-FILLS-FRAME (intimate detail, signage blurred behind)
- 10% LOW-ANGLE HERO (camera below figure, face visible, looking up toward neon overhead or three-quarter forward)
- 10% ASYMMETRIC OFF-CENTER (figure pushed to one side mid-action, face engaged)
- 8% THROUGH-FOREGROUND-OBJECT (looking through chain-link / rain-streaks / window AT the figure, NOT past the figure)
- 6% FORWARD THREE-QUARTER (figure angled toward viewer, hand at jacket or coat caught in motion)
- 4% TIGHT MEDIUM-SHOT (waist-up of figure mid-action)
- 2% EXTREME TOP-DOWN BIRD'S-EYE (rare — overhead 90-degree-straight-down on figure with face turned up)

DO write:
- Dutch-angle tilted-frame composition, off-axis tension, figure angled toward viewer mid-stride
- High-angle drone-down looking at figure crossing wet intersection, face turned up at the hovercar above
- Profile side-on composition, figure runs across frame mid-stride, face visible in profile
- Extreme close-up framing, face fills the frame, single cyber-eye catches a neon reflection
- Low-angle hero, camera below the figure looking up at her face haloed by neon overhead
- Asymmetric off-center composition, figure pushed to bottom-left third mid-leap, face engaged
- Through-rain-streaks composition LOOKING AT the figure, raindrops blur close, face soft-focus behind
- Forward three-quarter, figure mid-stride toward camera, coat hem caught in wind
- Tight medium-shot, figure waist-up mid-pull-of-cyberblade, face dominant in neon backlight
- Bird's-eye top-down (RARE), figure looks up at the camera, neon street wraps around her

DO NOT write:
- Over-shoulder POV "camera behind figure looking past at scene" — the audit flagged this as the dominant failure mode
- "Eyes forward not at camera" — eye direction is decided by the action, not the framing
- "Figure tiny against megabuilding" / wide-alley with figure swallowed by setting
- "From behind the figure / character" — any framing where the camera is BEHIND
- Photoreal camera specs (f/stops / mm)
- Multiple shots per entry
- Modern handheld shaky-cam

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
