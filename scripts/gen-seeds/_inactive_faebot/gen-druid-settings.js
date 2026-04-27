#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/druid_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRUID SETTING descriptions for FaeBot's druid path. Locations where nature magic is practiced — ritual circles, sacred groves, forest shrines, ley line nexuses.

Each entry: 10-20 words. A specific druid ritual/magical environment.

━━━ CATEGORIES TO COVER ━━━
- Stone circle in a forest clearing, each stone carved with glowing runes
- Ancient oak grove where the canopy is so thick it forms a living cathedral
- Ley line crossing point, visible energy streams humming in the earth
- Forest altar of stacked stones covered in moss, offerings of flowers and bone
- Cliffside hermitage overlooking an endless forest, wind-swept and wild
- Cave entrance behind a waterfall, painted with ancient nature symbols
- Bog edge at dusk, will-o'-wisps hovering above the dark water
- Fallen megalith half-swallowed by tree roots, still pulsing with old magic
- Forest floor where a lightning strike left a perfect circle of scorched earth
- Mushroom fairy ring that hums with druidic power when stepped inside
- Riverbank where a sacred tree leans over the water, roots exposed
- Hilltop grove visible for miles, the oldest trees in the forest gathered here

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: sacred site type + magic intensity + terrain.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
