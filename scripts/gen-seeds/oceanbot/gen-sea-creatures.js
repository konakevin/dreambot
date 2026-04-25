#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/sea_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SEA CREATURE + ENVIRONMENT scene descriptions for OceanBot. Each pairs a specific marine animal with a dramatic, unexpected, visually stunning underwater environment. The ANIMAL is half the scene, the SETTING is the other half — both must be jaw-dropping.

Each entry: 20-35 words. Animal + environment in one description.

━━━ CREATURE TYPES (mix broadly) ━━━
- Whales (humpback, blue, sperm, beluga, narwhal, gray)
- Sharks (great white, hammerhead, whale shark, thresher, blue, bull)
- Orcas, dolphins (bottlenose, spinner, dusky)
- Octopus (giant Pacific, mimic, blue-ringed, day octopus)
- Sea turtles (green, hawksbill, leatherback)
- Rays (manta, eagle, mobula, devil ray)
- Seals, sea lions, walruses
- Jellyfish (moon, lion's mane, barrel, crystal)
- Eels (moray, wolf eel, conger)
- Seahorses, leafy sea dragon, pipefish
- Nudibranchs, cuttlefish

━━━ ENVIRONMENTS (make them EXCITING) ━━━
- Cathedral kelp forests with god-ray shafts
- Volcanic vent fields with mineral chimneys and sulfur clouds
- Ice shelf edges with turquoise glacier walls
- Sunken ruins — columns, archways, statues overgrown with coral
- Deep abyssal trenches with bioluminescent particles
- Coral walls dropping into infinite blue void
- Underwater cave systems with light pouring through openings
- Ship graveyard fields with encrusted hulls
- Mangrove root mazes with dappled light
- Open ocean pelagic blue with sun pillars from above
- Tide pools at dramatic cliff bases
- River-meets-ocean brackish zones with sediment swirls
- Under Arctic ice with light filtering through frozen ceiling
- Seagrass meadows with shafts of golden afternoon light

━━━ RULES ━━━
- BOTH creature AND environment must be specific and vivid
- NOT just "shark in ocean" — describe the exact setting that makes it dramatic
- Vary species, environments, moods, lighting conditions
- No repeats of the same animal+environment combo
- The pairing should feel unexpected or cinematic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
