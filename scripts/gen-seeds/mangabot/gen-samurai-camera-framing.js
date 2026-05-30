#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for a MangaBot samurai-era keyframe. Each entry is the SHOT TYPE — how the camera frames the world. Painterly anime keyframe conventions, NOT photoreal cinematography.

Each entry: 8-16 words. Names the framing + the painterly composition style.

⚠️ NEVER write "back-of-character looking out at scene" framings. The audit on 2026-05-29 found 18% of this pool was over-shoulder / lone-figure-tiny / silhouette-from-behind — that compounded into a homogenous back-to-camera composition across nearly every render. Recipe rewritten 2026-05-29 to PURGE those framings entirely.

FRAMING VARIETY (target distribution — ALL forward-facing-or-profile):
- 22% LOW-ANGLE HERO (camera below the figure, samurai rising into frame; face visible, three-quarter forward, body engaged)
- 18% MEDIUM SHOT (figure at 35-50% of frame, full setting visible, face readable, three-quarter forward or profile)
- 16% PROFILE DYNAMIC-ACTION (side-on full silhouette caught mid-strike / mid-draw / mid-leap, face visible in profile, body torqued)
- 14% FORWARD THREE-QUARTER (figure angled toward viewer at 3/4, sword drawn or hand on hilt, face engaged)
- 10% TIGHT MEDIUM-SHOT (waist-up or chest-up of the figure mid-action, face dominant, dynamic expression)
- 8% HIGH-ANGLE EPIC (camera above, looking down on figure + landscape; figure still ENGAGED, face turned upward toward something, not a back-of-head shot)
- 6% DUTCH-ANGLE TENSION (tilted frame, pre-action tension, figure still angled toward viewer or in profile)
- 4% EXTREME CLOSE-UP CONTEXT (hand at hilt with battle behind, eye in mid-distance, or single-detail focus)
- 2% LONG-LENS COMPRESSION (telephoto feel, layers stacked tight, figure mid-action at midground)

DO write:
- Low-angle hero framing, camera below the rising samurai, three-quarter forward, sword catching first light
- Medium shot composition, samurai at three-quarter view, sword half-drawn, ruined temple filling midground
- Profile dynamic-action framing, side-on full silhouette mid-strike against burning sky
- Forward three-quarter composition, samurai facing the approaching threat, hand on hilt, eyes locked ahead
- Tight medium-shot, samurai chest-up mid-prayer at the shrine, face dominant in painterly soft light
- High-angle epic, looking down across rice paddies, samurai pausing on the path with face turned up at flock of cranes
- Dutch-angle tension framing, slight tilt before the strike, figure angled toward viewer mid-draw
- Extreme close-up, hand wrapped on hilt with retreating banner-army blurred in deep background

DO NOT write:
- Over-shoulder framings showing the character's BACK as the subject (e.g. "camera behind the samurai looking at gate" — this defaults to back-of-character renders)
- Wide vista with "figure tiny against world" / "lone samurai a brushstroke" / "figure swallowed by valley" — those produce tiny-back-silhouette renders
- "From behind the samurai/figure/hero" — any framing where the camera is BEHIND and looking PAST the character at the world
- "Still / motionless / watching / crouched [swordsman / figure / silhouette]" without an explicit FRONT-FACING follow-up — these default to back-of-figure renders
- "Lone warm silhouette" / "single faint silhouette" / "figure silhouetted in/at [doorway/threshold/cellar/cavern]" — these are all back-of-figure compositions
- "Long-lens compressed framing, X behind the still swordsman" — back-of-figure pattern with depth behind
- "Eyes forward not at camera" — eye direction is decided by the action, not the framing
- Photoreal camera specs (35mm / f/2.8 / shutter-speed — keep it painterly-anime concept)
- Multiple shots per entry — ONE framing only
- Modern camera moves (drone-pan / steadicam / handheld-shaky)
- Anime cliche framing terms ("speed lines" / "panel-split" — keep it cinematic-keyframe register)

The default Flux failure mode for "anime + samurai + cinematic" is the back-of-katana-wielder silhouette against an epic vista. Every entry in this pool must STRUCTURALLY push against that default — the camera angles MUST keep the character's face / front / engagement visible.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
