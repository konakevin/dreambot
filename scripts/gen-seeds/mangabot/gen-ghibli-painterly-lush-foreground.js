#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_lush_foreground.json',
  total: 25,
  batch: 25,
  append: false, // R1 rewrite — span lush AND sparse
  metaPrompt: (n) => `Write ${n} FOREGROUND TREATMENT entries for a MangaBot ghibli-painterly keyframe. The R0 pool was too maximalist — every entry wall-to-wall foliage made every render feel overstuffed. R1 SPANS lush AND minimal so the path gets RANGE.

Each entry: 10-22 words. ONE foreground treatment description, ranging from quiet-minimal to wall-to-wall-lush.

VARIETY (25 bespoke entries — explicit range):
- 35% LUSH layered foliage (Ghibli signature dense wrap — moss + petals + ferns + mushrooms)
- 25% SIMPLE FOCAL ELEMENT (one or two clean elements in foreground — a single stone lantern, a curved branch, a fallen leaf — Mononoke quiet)
- 20% NEGATIVE-SPACE EMPTY (foreground is mostly empty stone path / water / mist — Whisper-of-the-Heart stillness)
- 10% PETAL DRIFT (just blossoms cascading across the foreground, no other props — sakura signature)
- 10% WATER-EDGE (foreground is a pool or stream reflecting the architecture, no foliage)

DO write (sample of the full range):
LUSH:
- Moss-covered ancient stones in the foreground, ferns unfurling between them, dewdrops catching morning light
- Cluster of glowing red-cap mushrooms in deep emerald moss in the foreground, fireflies hovering above
- Wildflower carpet — pink, yellow, lavender — wrapping the foreground, bees drifting between blooms
- Ivy curtains hanging from the cliff edge into the foreground, leaves trembling in the updraft
- Cherry blossom petals cascading in pink drifts across the foreground, settling on a mossy stone lantern

SIMPLE FOCAL:
- A single weathered stone lantern at the foreground edge, moss creeping up its base
- A curved cedar branch sweeps into the foreground, three leaves catching the light
- A single fallen autumn maple leaf in the foreground stone path, gold-amber against grey
- A weathered torii post at the foreground edge, lacquered red paint cracked at the base
- One offered ceramic teapot on a stone step at the foreground, steam rising thin

NEGATIVE-SPACE EMPTY:
- The foreground is mostly empty stone path, single line of cracks running through the slabs
- The foreground is quiet water, still as glass, the architecture reflected on its surface
- The foreground is morning mist rolling low, just a hint of stone or grass beneath
- The foreground is cobblestone bare and weathered, single shadow falling across it
- The foreground is unbroken sand or snow, no other elements, all eye-leading to the anchor

PETAL DRIFT:
- Cherry blossoms drift in pink rain across the foreground, only petals, no other elements
- Autumn maple leaves cascade across the foreground in copper and amber, no other props
- White plum blossoms drift across the foreground, single petals catching the light

WATER-EDGE:
- The foreground is a tarn pool reflecting the spire, lily-pads scattered on its surface
- The foreground is a slow-flowing stream with stepping-stones leading toward the anchor
- The foreground is a tide-pool with kelp and tiny anemones, water clear over pale sand

DO NOT write:
- Hero-character close-up
- Modern objects (no plastic / no concrete)
- Photoreal botany — painterly Ghibli register
- Single hyper-detailed element that overwhelms the architecture
- Western objects (no Tuscan villa garden / no English cottage rose)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
