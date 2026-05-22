#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_camera_framing.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for a MangaBot samurai-era keyframe. Each entry is the SHOT TYPE — how the camera frames the world. Painterly anime keyframe conventions, NOT photoreal cinematography.

Each entry: 8-16 words. Names the framing + the painterly composition style.

FRAMING VARIETY (target distribution):
- 20% WIDE CINEMATIC (extreme-wide vista, figure tiny against world)
- 18% MEDIUM SHOT (figure at 25-45% of frame, full setting visible)
- 15% LOW-ANGLE HERO (camera below, figure rising into frame against sky)
- 12% HIGH-ANGLE EPIC (camera above, looking down on figure + landscape)
- 12% OVER-SHOULDER (camera behind figure looking past them toward target)
- 10% DUTCH-ANGLE TENSION (tilted frame, pre-action tension)
- 8% LONG-LENS COMPRESSION (telephoto feel, layers stacked tight)
- 5% EXTREME CLOSE-UP CONTEXT (hand at hilt with battle behind, eye in mid-distance)

DO write:
- Wide cinematic vista framing, painterly keyframe composition, figure small against the world
- Medium shot composition, figure at three-quarter view filling the lower-third of frame
- Low-angle hero framing, camera below the figure, rising into a great sky
- High-angle epic composition, looking down across the landscape with figure in mid-distance
- Over-shoulder framing from behind the figure, looking past them toward the great gate
- Dutch-angle tension framing, slight tilt before the action breaks
- Long-lens compressed framing, depth layers stacked tightly painterly-anime style

DO NOT write:
- Photoreal camera specs (35mm / f/2.8 / shutter-speed — keep it painterly-anime concept)
- Multiple shots per entry — ONE framing only
- Modern camera moves (drone-pan / steadicam / handheld-shaky)
- Anime cliche framing terms ("speed lines" / "panel-split" — keep it cinematic-keyframe register)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
