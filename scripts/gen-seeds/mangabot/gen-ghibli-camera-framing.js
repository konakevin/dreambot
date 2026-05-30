#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot ghibli-countryside keyframe. Painterly Ghibli concept-art keyframe convention.

⚠️ NEVER write "back-of-character looking out at scene" framings. The audit on 2026-05-29 found 13% of this pool was over-shoulder-from-companion / figure-silhouetted-in-doorway / figure-tiny-on-hilltop — that compounded into homogenous back-to-camera renders. Recipe rewritten 2026-05-29 to PURGE those framings.

Each entry: 8-16 words. Names the framing + Ghibli composition style.

GHIBLI FRAMING VARIETY (ALL forward-facing-or-profile):
- 18% MEDIUM-SHOT PASTORAL (figure at 35-55% of frame, face visible at three-quarter forward, lived-in detail surrounding)
- 14% THROUGH-FOREGROUND (looking through tall grass / branches / window AT the figure's face, not past them)
- 12% LOW-ANGLE LOOKING UP (camera near ground, figure rising into sky, face turned upward or three-quarter forward)
- 12% PROFILE / SIDE-ON (figure crosses frame in profile, motion implied, face in profile, body engaged in task)
- 10% INTERIOR-COTTAGE FRAMING (figure inside, face visible mid-task, window/doorway frames countryside behind them)
- 10% CLOSE-CONTEXT (face caught at three-quarter forward, environment soft-focus behind)
- 8% FORWARD THREE-QUARTER (figure angled toward viewer at 3/4, mid-rural-task, face engaged)
- 6% DAPPLED-THROUGH-TREES (camera in dappled-shadow looking out at sunlit figure, face visible)
- 5% HIGH-ANGLE FROM ROOF (camera elevated; figure looks up at the sky/sun/bird, NOT a back-of-head shot)
- 4% TIGHT MEDIUM-SHOT (waist-up or chest-up of the figure mid-task, face dominant)
- 1% WIDE-ESTABLISHING (used sparingly — figure still 25%+ of frame mid-task, NOT a brushstroke against world)

DO write:
- Medium-shot pastoral, figure at three-quarter view filling lower-half of sunlit meadow, basket of vegetables in hand
- Through-tall-grass foreground, wildflowers blur in close focus, figure's face visible beyond at three-quarter forward
- Low-angle looking up, camera flat among clover, figure's face caught looking up at flock of cranes crossing sky
- Profile side-on, figure crosses bridge in profile, fabric caught in wind, face readable in profile
- Interior cottage framing, figure inside sweeping floor, face visible at three-quarter, window frames countryside
- Close-context, figure's face caught at three-quarter view holding a teacup, kitchen warm-focus behind
- Forward three-quarter composition, figure angled toward viewer, hanging laundry mid-motion, face engaged
- Dappled-through-trees framing, camera in forest shadow looking out at sunlit figure picking flowers, face visible
- High-angle from-rooftop, figure looks up at the camera carrying a bundle of hay across the yard
- Tight medium-shot, figure chest-up at the well drawing water, face dominant in dappled afternoon light

DO NOT write:
- Over-shoulder framings "camera behind companion/sibling/goat/cat looking at figure" — the audit flagged this as the dominant failure mode
- "Figure silhouetted in doorway" / silhouette-from-behind in any composition
- "Figure a brushstroke against pastoral plain" / wide vista with figure tiny
- "From behind the figure / character" — any framing where the camera is BEHIND
- Photoreal camera specs (f-stops / mm)
- Multiple shots per entry
- Modern handheld / dolly-tracking dramatic
- Cyberpunk framing (worm's-eye up megabuilding)
- Combat framing (dutch-angle tension)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
