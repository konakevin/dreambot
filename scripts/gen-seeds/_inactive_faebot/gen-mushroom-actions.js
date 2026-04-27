#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/mushroom_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MUSHROOM SPIRIT ACTION descriptions for FaeBot's mushroom-spirit path. Each entry is what a mycelium being is DOING in her fungal domain — tending the network, spreading spores, communing with decay. Alien and beautiful. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific fungal-spirit action.

━━━ CATEGORIES TO COVER ━━━
- Releasing a cloud of luminous spores from her palms, watching them drift upward
- Growing new mushrooms from the ground by touching the soil with her toes
- Communing with the mycelium network, eyes closed, tendrils of white extending from her fingers into the earth
- Eating a bioluminescent mushroom, her own glow intensifying as she absorbs it
- Walking across a fallen log, new fungi sprouting in her footprints behind her
- Reaching up to touch a tree branch, shelf fungi blooming instantly where she touches
- Dissolving her lower body into a carpet of mycelium, spreading across the forest floor
- Weaving spore threads between her fingers like a cat's cradle
- Absorbing a dead leaf into her palm, recycling it into living fungal growth
- Breathing out a fine mist of luminous spores that light up the dark forest
- Pulling a strand of mycelium from the ground like a nerve, reading it
- Embracing a rotting tree trunk, accelerating its decomposition into rich soil

━━━ BANNED ━━━
- Sitting / lying passively
- "Posing", "modeling", looking at the camera
- Second figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + fungal process (growth/decay/spore/network).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
