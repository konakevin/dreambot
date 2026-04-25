#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/marine_portrait_subjects.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MARINE CREATURE PORTRAIT descriptions for OceanBot. Each is a single marine creature described for a close-up portrait — capturing personality, texture, and presence.

Each entry: 15-25 words. One specific creature portrait.

━━━ CREATURE TYPES (mix broadly across all) ━━━
- Whales (humpback, blue, sperm, beluga, narwhal)
- Sharks (great white, hammerhead, whale shark, thresher, blue)
- Octopus and cuttlefish (mimic, blue-ringed, giant Pacific, flamboyant cuttlefish)
- Sea turtles (green, hawksbill, leatherback, loggerhead)
- Rays (manta, eagle, stingray, mobula)
- Seahorses (leafy sea dragon, pygmy, weedy)
- Nudibranchs (Spanish dancer, blue dragon, chromodoris)
- Eels (moray, garden eel, ribbon eel)
- Dolphins and orcas
- Jellyfish (moon, lion's mane, box, Portuguese man o' war)
- Lobsters, crabs, nautilus, seals, manatees

━━━ RULES ━━━
- Close-up portrait framing — eye contact, texture, personality
- Describe the creature's specific features, colors, posture
- No repeats — vary species, angle, mood, behavior
- Vivid specific language, not generic descriptions

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
