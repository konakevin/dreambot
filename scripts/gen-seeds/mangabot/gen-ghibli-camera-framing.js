#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA-FRAMING entries for a MangaBot ghibli-countryside keyframe. Painterly Ghibli concept-art keyframe convention.

CRITICAL VARIETY MANDATE: do NOT default to "wide pastoral vista with figure tiny on hilltop." Mix many compositions.

Each entry: 8-16 words. Names the framing + Ghibli composition style.

GHIBLI FRAMING VARIETY:
- 16% MEDIUM-SHOT PASTORAL (figure at 25-45% of frame, full setting visible)
- 14% THROUGH-FOREGROUND (looking through tall grass / branches / window in foreground)
- 12% WIDE-ESTABLISHING (sweeping landscape with figure small — used sparingly)
- 11% OVER-SHOULDER FROM COMPANION (camera behind one figure looking at other / scene)
- 10% LOW-ANGLE LOOKING UP (camera near ground, figure rising into sky)
- 9% INTERIOR-COTTAGE FRAMING (figure inside, window or doorway frames countryside beyond)
- 8% CLOSE-CONTEXT (face caught with environment soft-focus behind)
- 7% DAPPLED-THROUGH-TREES (camera in dappled-shadow looking out at sunlit scene)
- 6% HIGH-ANGLE FROM ROOF (camera elevated, looking down on pastoral scene)
- 5% PROFILE / SIDE-ON (figure crosses frame in profile, motion implied)
- 2% EXTREME WIDE (figure barely visible in vast landscape — RARE poster shot)

DO write:
- Medium-shot pastoral composition, figure at three-quarter view filling the lower-third of frame
- Through-tall-grass foreground, wildflowers blur in close focus, figure visible beyond
- Wide-establishing vista (USED SPARINGLY), pastoral landscape with figure small
- Over-shoulder framing from behind a second figure, looking at the first figure and scene beyond
- Low-angle looking up, camera near the ground, figure rising into the sky background
- Interior cottage framing, figure inside, window or doorway frames the countryside view
- Close-context composition, figure's face caught in three-quarter view, environment soft-focus
- Dappled-through-trees framing, camera in dappled forest shadow looking out at sunlit field
- High-angle from-rooftop, camera elevated looking down on the pastoral scene
- Profile side-on composition, figure crosses the frame in profile, motion implied

DO NOT write:
- Photoreal camera specs (f-stops / mm)
- Multiple shots per entry
- Modern handheld / dolly-tracking dramatic
- Cyberpunk framing (worm's-eye up megabuilding)
- Combat framing (dutch-angle tension)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
