#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/bee_keeper_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAE BEEKEEPER ACTION descriptions for FaeBot's bee-keeper path. Each entry is what a fae beekeeper is DOING with her hives and bees — tending, harvesting, building, communicating. Dynamic freeze-frames of bee-craft. SOLO.

Each entry: 10-20 words. A specific bee-tending action.

━━━ CATEGORIES TO COVER ━━━
- Reaching bare-handed into a hive, bees crawling up her arms without stinging
- Harvesting a dripping honeycomb frame, golden honey streaming down her wrists
- Pressing her forehead against the hive wall, eyes closed, listening to the colony hum
- Building new honeycomb cells with her bare hands alongside the worker bees
- Carrying a clay pot overflowing with fresh honey on her hip through a meadow
- Coaxing a swarm to follow her by humming, the cloud of bees moving with her song
- Splitting a hive into two colonies, carefully moving the queen in her cupped hands
- Painting beeswax onto honeycomb walls to seal and strengthen the structure
- Feeding a weakened bee from a drop of honey on her fingertip
- Checking brood frames, holding comb up to the light to inspect larvae
- Collecting propolis from hive edges with a small blade, dropping it into a pouch
- Walking through a field of wildflowers trailing bees behind her like a living cape

━━━ BANNED ━━━
- Sitting / lying passively / sleeping
- "Posing", "modeling", looking at the camera
- Being stung or in distress (she is IN HARMONY with her bees)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + bee-craft element (honey/comb/swarm/queen/propolis).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
