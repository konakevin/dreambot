#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_scifi_elements.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SCI-FI ELEMENT descriptions for PixelBot's pixel-sci-fi path. Each entry is a specific sci-fi subject, object, or focal point. The SETTING will be picked separately.

Each entry: 8-15 words. One specific sci-fi visual element.

━━━ CATEGORIES TO COVER ━━━
- Vehicles (hovercars, starfighters, mech suits, hover-bikes, submarines)
- Robots/AI (service droids, combat mechs, holographic AI, android)
- Tech objects (glowing terminals, hologram displays, laser grid, teleporter pad)
- Alien life (bioluminescent creatures, crystal entities, spore clouds)
- Weapons/tools (plasma rifle, energy shield, gravity gun, data-blade)
- Phenomena (wormhole, energy storm, time rift, solar flare)
- Cybernetics (neon-traced augmented limbs, neural jack, eye implants)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: object category + visual signature.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
