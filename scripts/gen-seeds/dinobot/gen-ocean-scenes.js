#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/ocean_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PREHISTORIC OCEAN scene descriptions for DinoBot — marine reptiles and sea life of the Mesozoic. Underwater and surface shots.

Each entry: 15-25 words. One specific marine scenario with species + underwater/surface setting + lighting.

━━━ CATEGORIES ━━━
- Plesiosaur gliding through kelp forests, long neck undulating
- Mosasaur hunting in open water, massive jaws pursuing prey
- Ichthyosaur pod breaching the surface like dolphins
- Ammonites drifting in deep currents, spiral shells catching light
- Giant sea turtle cruising through a coral reef
- Elasmosaurus with neck extended above the waves, scanning
- Liopleurodon patrolling dark ocean depths
- Underwater volcanic vents with marine reptiles circling in warm water
- Surface shot — marine reptile silhouetted against a sunset sea
- School of prehistoric fish with a massive predator shadow below
- Half-submerged shot — above water sky meets below water depth
- Bioluminescent deep-sea scene with marine reptiles in the glow

━━━ RULES ━━━
- Underwater lighting is key — light shafts, murky depths, surface glow
- Include marine environment texture (kelp, coral, sand, volcanic rock)
- Mix surface and underwater perspectives
- The prehistoric ocean is alien, beautiful, and terrifying

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
