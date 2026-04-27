#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_legend_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID OBSERVING MOMENT descriptions for OceanBot's mermaid-legend path. She is a mysterious mermaid quietly OBSERVING something — absorbed, contemplative, curious. She is NOT doing anything dramatic. She is still or nearly still, studying something that has caught her attention.

Each entry: 10-20 words. A specific quiet observing moment.

━━━ WHAT SHE MIGHT BE OBSERVING ━━━
Focus on NATURAL and DISTANT things — the ocean, the sky, the weather, marine life. NOT small handheld human objects (no dolls, books, music boxes, pocket watches, coins — these render as random plastic props and break the scene).
- The horizon: a distant ship's silhouette, a lighthouse beam, sails on the horizon, a faraway storm
- The sky/weather: storm clouds gathering, aurora, dawn breaking, moonrise, stars wheeling overhead
- Marine life: a whale surfacing, dolphins passing, fish in the shallows, jellyfish drifting, seabirds circling
- The ocean itself: waves crashing on rocks, her own reflection, moonlight on the water, tidal patterns
- Underwater: coral formations, kelp forests swaying, light filtering through waves, shipwreck in the depths
- Large wreckage (in the environment, not in her hands): a ship's hull on rocks, a broken mast, a sunken anchor

━━━ HER POSTURE — THREE OPTIONS ONLY ━━━
SWIMMING: half-submerged in water, chest and head above surface, tail hidden below. Use for ~70% of entries — these render best and avoid anatomy issues.
SITTING: upright on a rock or stone, tail curving down into water or draped over the edge. Use for ~30%.

TAIL POSITION: the tail always curves GENTLY to one side, following the body's natural line. NEVER straight out behind her, NEVER bent at a sharp angle.

BANNED (these render badly):
- NO standing, NO kneeling (she has no legs/knees/feet)
- NO lying flat on stomach
- NO floating on water surface
- NO hovering in air
- Vary what she is observing AND her posture — no two the same
- She can look wistful, curious, puzzled, enchanted, melancholy, fascinated
- FACING DIRECTION (spread evenly across all entries):
  - 40% facing toward the viewer (we see her face clearly)
  - 30% profile view (side angle, face partially visible)
  - 30% facing away or three-quarter away
  - Include the facing direction in each entry (e.g. "facing us", "in profile", "looking over her shoulder toward us", "turned away")

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: what she observes + her posture + her mood/expression.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
