#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/cosmic_scenes.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COSMIC / ALIEN scene descriptions for BloomBot's cosmic path — otherworldly flower visuals that break physics / biology / location. Alien planets, outer space, bioluminescent jungles, cosmic botanical phenomena. Think Avatar-Pandora, nebula-born flora, flowers in zero-g.

Each entry: 18-35 words. Names the cosmic context + the floral phenomenon.

━━━ CATEGORIES ━━━
- Alien planet surfaces with impossible bloom biology
- Bioluminescent Avatar-Pandora-style jungles at night
- Flowers floating in zero-gravity inside nebulae
- Flower-shaped galaxies / nebulae / cosmic formations
- Crystalline alien blooms growing on asteroid surfaces
- Underwater alien-reef flowers on a distant moon
- Flowers erupting from black holes / singularity edges
- Ringed planet surfaces with alien hanging gardens
- Space-station greenhouse with genetically-impossible blooms visible through viewport
- Alien ice-planet with frozen crystal flowers
- Bioluminescent deep-space coral-like blooms
- Flowers growing from asteroid rubble adrift in space
- Alien cave systems with phosphorescent flower colonies
- Nebula-colored blooms in aurora atmosphere
- Flowers orbiting a small star like rings
- Gas-giant atmosphere with impossible floating flora
- Alien desert with translucent silica-petal flowers
- Galactic core with flower-shaped dust clouds
- Alien waterfall / bioluminescent cascade with glowing blooms
- Exoplanet twilight with cosmic sunset + impossible flora
- Flowers made of stardust / plasma / pure light
- Cosmic garden on a moon orbiting a gas giant
- Astral plane with flowers of pure energy
- Alien planet with magnetic-field-responsive blooms
- Bioluminescent coral/flower hybrid on underwater alien world
- Spiral galaxy with a flower-bloom core
- Hanging flower chandelier-structures in asteroid cavern
- Flowers emerging from fractal geometry in void
- Alien moonrise over bloom-covered valley
- Cosmic bloom garden under three suns

━━━ RULES ━━━
- Otherworldly — alien planet / space / cosmic phenomenon
- Flowers still the hero (not just a sci-fi scene with a flower in it)
- NOT earthly-surreal (that's dreamscape path)
- Breath-taking sci-fi beauty

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
