#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/spore_light_atmospheres.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT ATMOSPHERE descriptions for FaeBot's spore-light path. Light conditions, spore density, color gradients, moisture levels for a bioluminescent forest at night. NO characters — these are environmental atmosphere descriptions only.

Each entry: 10-20 words. A specific lighting/atmospheric condition.

━━━ CATEGORIES TO COVER ━━━
- Dense spore clouds drifting at knee height, each particle a pinpoint of cyan light
- Deep blue darkness with scattered points of green bioluminescence like underwater stars
- Fog rolling through, catching and diffusing the glow into soft color halos
- Rain falling through bioluminescent spore clouds, each drop trailing a streak of light
- Total darkness except for the fungi, blackness making the colors intensely vivid
- Moonlight filtering through the canopy mixing silver with the blue-green bioluminescence
- Thick humidity making the air itself glow faintly, every breath visible as luminous mist
- Pulsing rhythm — the entire colony brightening and dimming in slow synchronized waves
- Two-tone split: blue mycelium on the ground, violet mushroom caps above, meeting at eye level
- Spore eruption — a mushroom releasing a massive cloud of golden particles into the dark
- Frost on every surface, ice crystals refracting the bioluminescence into prismatic shards
- Dawn approaching, the last minutes of peak glow before daylight begins to wash it out

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: dominant color + atmospheric condition (fog/rain/frost/clear/humid) + dynamic element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
