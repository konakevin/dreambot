#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_earth_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY EARTH SCENE descriptions for EarthBot's "cozy-nature" path. Warm, inviting, "I WANT TO BE HERE" earthly nature — the intimate soul of Earth that makes a person exhale.

Each entry: 15-30 words. One specific warm + inviting earthly nature scene.

━━━ CATEGORIES TO DRAW FROM ━━━
- Sun-dappled forest clearings with wildflowers
- Willow-lined slow river bends in summer afternoon
- Sunlit meadow edges at golden hour
- Pine trails with filtered sunlight
- Mossy creek-crossings with stepping stones
- Alpine meadows in late summer bloom
- Autumn groves of golden aspen with dappled light
- Birch forests with low-angle morning sun
- Warm sandy dune-hollow with shelter from wind
- Apple orchards in late summer with low light
- Sun-warmed rocks beside still lake shore
- Forest paths with hemlock + fern understory
- Grassy hillsides with wildflower scatter
- Shaded picnic-spot clearings in old-growth
- Warm sunny tide-pool rocks at low-tide
- Sunlit river bars with smooth stones
- Wheat-field edges in golden hour
- Meadow sides with long grass swaying
- Apple-blossom canopies in spring sun

━━━ RULES ━━━
- NO humans
- NO animal subjects
- Warm + inviting + welcoming — never dramatic/harsh
- Earth-plausible ground-level scenery
- Dial the cozy + inviting factor up — this path is about the SOUL of cozy nature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
