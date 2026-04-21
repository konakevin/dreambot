#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/cozy_animal_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY ANIMAL MOMENT descriptions for AnimalBot's cozy path — REAL wildlife (photoreal Nat-Geo quality) in warm, cozy, intimate natural settings. The emotional read is cozy + warm + peaceful — distinct from CuddleBot's stylized cuteness.

Each entry: 15-30 words. One real-species + warm-setting moment.

━━━ CATEGORIES ━━━
- Fox curled in autumn leaves under slanting amber sun
- Sleeping bear cub in sun-dappled den entrance with ferns
- Owl in warm hollow tree cavity, golden hour light on face
- Sleeping lynx in moss-cushion clearing, filtered sun through pines
- Arctic fox curled in snow hollow with pale-blue light
- Red squirrel nestled in tree crook sipping dew from paw
- Hedgehog in leaf-nest among ferns, warm afternoon light
- Deer fawn resting in tall grass speckled with wildflowers
- Otter curled on warm rock in sun beside creek
- Songbird puffed and sleeping on branch in rosy evening light
- Marten napping in hollow log with soft light through forest
- Red panda curled on mossy branch at sunset
- Bear cub asleep in meadow with wildflowers around
- Fox kits huddled in den entrance warm-lit by late sun
- Snow monkey drifting in hot spring steam
- Rabbit in burrow-opening sniffing warm dusk air
- Sleeping baby elephant trunk-curled in dry grass
- Cheetah cub napping against mother's belly in golden grass
- Kit-fox pup in sandy burrow mouth with evening light
- Chipmunk with cheeks-full in warm sunlit grass clearing

━━━ RULES ━━━
- REAL species, photoreal Nat-Geo quality
- WARM + cozy + intimate emotional read (not stylized-cute)
- Include specific warm-light / cozy-setting element
- NO humans
- LAND animals only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
