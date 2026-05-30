#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_lush_foreground.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} LUSH FOREGROUND entries for a MangaBot ghibli-painterly keyframe. This wraps the FRAME EDGES with painterly foliage / petals / moss / ferns / mushrooms — Studio Ghibli's signature dense foreground that frames the monumental anchor. Per [[feedback_intimate_paths_still_lush]] — Ghibli is NEVER minimalist, every frame is wall-to-wall layered detail.

Each entry: 12-22 words. ONE specific lush foreground composition — moss + petals + ferns + flowers + mushrooms + vines together.

VARIETY (25 bespoke entries):
- 20% MOSS-COVERED STONES with ferns wrapping foreground edge (Mononoke / Spirited-Away forest floor)
- 15% CHERRY-BLOSSOM PETAL CASCADE drifting across foreground (sakura rain in fg)
- 15% GLOWING MUSHROOM CLUSTER in foreground (Mononoke / Princess Mononoke deep forest fg)
- 10% IVY CURTAIN hanging from cliff edge into frame foreground
- 10% WILDFLOWER CARPET in foreground (Howl's wildflower hills register)
- 10% FALLEN AUTUMN LEAVES + acorns + persimmons at fg
- 10% PALM-FERN / GIANT-FROND wrapping foreground edges
- 5% DRIFTING POLLEN / SPORES / FIREFLIES in fg air
- 5% DEW-COVERED LEAF CANOPY with rainbow refractions in fg drops

DO write:
- Moss-covered ancient stones in the foreground, ferns unfurling between them, dewdrops catching morning light
- Cherry blossom petals cascading in pink drifts across the foreground, settling on a mossy stone lantern
- Cluster of glowing red-cap mushrooms in deep emerald moss in the foreground, fireflies hovering above
- Ivy curtains hanging from the cliff edge into the foreground, leaves trembling in the updraft
- A carpet of wildflowers in pink, yellow, and lavender wrapping the foreground edge, bees drifting between blooms
- Fallen autumn leaves in copper and amber pile against the foreground stones, single ripe persimmon at their edge
- Giant palm-fern fronds frame the foreground, their lobes catching slanted light from above
- Drifting golden pollen suspended in the foreground air, fireflies winking on and off
- Dewdrops on a fern canopy in the foreground refracting rainbow light from the sun-shaft behind

DO NOT write:
- Empty / sparse / minimalist foreground (Ghibli is NEVER bare)
- Hero-character close-up
- Single element without layering (always 2+ items per entry)
- Modern objects (no plastic / no concrete)
- Photoreal botany — painterly Ghibli register

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
