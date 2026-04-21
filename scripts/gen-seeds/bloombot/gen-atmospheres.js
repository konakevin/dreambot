#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERE / PARTICLE descriptions for BloomBot renders. Each is an in-frame ambient element that adds magic to the floral scene.

Each entry: 8-18 words. One specific atmospheric element.

━━━ CATEGORIES ━━━
- Falling petals (rose petals spiraling down, cherry blossom drift, wisteria-fall)
- Floating particles (pollen motes catching light, seed-fluff drifting, spore-dust)
- Dewdrops (clinging to petals, suspended on spider silk, beading on leaves)
- Mist / fog (low morning fog weaving stems, magical mist coiling, ethereal haze)
- Insects (bee mid-flight, hummingbird hovering, butterfly alighting, dragonfly suspended)
- Magical glow (fireflies drifting, will-o-wisps, glowing spores, motes of light)
- Weather (light rain catching petals, gentle snowfall on blooms, warm breeze rippling)
- Sunbeams / god-rays piercing flora
- Drifting leaves / branches moving
- Reflections (water droplets reflecting blooms, puddle mirrors)
- Steam / vapor (from warm ground, morning glass condensation)
- Floating lanterns / sparkles (enchanted quality)
- Aurora-borealis shimmer overhead
- Cosmic dust / stardust (for cosmic path)
- Bioluminescent motes (for cosmic / dreamscape)
- Ripples on water surface reflecting flowers
- Fabric / ribbon / silk billowing in breeze
- Smoke / incense curling
- Pollen cloud backlit by sun
- Rain-kissed dew reflecting spectrum colors

━━━ RULES ━━━
- One element per entry
- Works across paths (not path-specific)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
