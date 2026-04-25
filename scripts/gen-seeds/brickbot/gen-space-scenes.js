#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/space_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EPIC LEGO SPACE scene descriptions for BrickBot. These are MASSIVE, JAW-DROPPING dioramas — not small vehicles or single minifigs. Think LEGO Masters finale builds at planetary scale.

Each entry: 15-25 words. One specific EPIC space scene.

━━━ SCENE TYPES (mix broadly across ALL — go BIG) ━━━
- Alien megacities with towering spires, glowing transparent windows, thousands of bricks, sprawling across an entire planet surface
- Massive space battles with dozens of ships, laser beams criss-crossing, explosions, capital ships dwarfing fighters
- Colossal space stations the size of moons, rotating rings, docking bays with fleets of ships
- Alien worlds with bizarre landscapes — crystal forests, floating islands, bioluminescent oceans, volcanic hellscapes
- Planet-cracking mining operations, industrial megastructures consuming asteroids
- Ancient alien ruins on desolate moons, massive stone temples overgrown with alien flora
- Nebula-lit asteroid fields with hidden pirate bases carved into rock
- Generation ships — mile-long vessels with entire cities visible through transparent hull sections
- Terraforming operations transforming dead worlds, massive atmosphere processors, dome cities
- Alien jungles with towering bio-luminescent plants, strange creatures, expedition camps
- Gas giant cloud cities floating in swirling storms, connected by bridge networks
- Dyson sphere construction around a star, scaffolding at cosmic scale
- Wormhole gateways with ships emerging, reality-bending geometry, energy crackling
- Frozen ice worlds with crystalline caverns, underground civilizations, geothermal vents

━━━ RULES ━━━
- EPIC SCALE — every scene should feel massive, complex, awe-inspiring
- NO small vehicles alone, NO single minifigs, NO simple cockpit closeups
- The scene IS the star — environments, worlds, massive constructions
- Specify LEGO brick types: transparent pieces, slopes, plates, technic, greebling
- Vary wildly: alien vs human, peaceful vs war, ancient vs futuristic
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
