#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/reef_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CORAL REEF SCENE descriptions for OceanBot. Each is a vivid snapshot of a specific coral reef scene bursting with tropical fish abundance, multi-species chaos, and shallow sunlit water — but BLOWN UP to AI-impossible levels.

Each entry: 28-40 words. One specific reef scene with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Dense schooling fish spiraling around coral pillars + godrays piercing canopy + bioluminescent plankton drifting
- Butterflyfish clusters in brain coral valleys + caustic-net light dancing on sand + glowing fluorescent coral edges
- Nudibranch explosions across reef walls in impossible color variants under triple-rainbow surface refraction
- Clownfish anemone colonies + damselfish swarms + visible sun-storm and rainbow above the surface
- Soft coral forests swaying + gobies and shrimp + suspended marine snow + amber sunset-light filtering down
- Gorgonian fan walls with barracuda schools + bioluminescent reef-glow + caustic shafts cutting through
- Skyscraper-scale coral spires shooting from abyss + fish at every story + godrays and bioluminescent abyssal glow
- Cathedral-scale tide-pool reef the size of a city block + caustic-net dancing on floor + sky reflected on surface
- Reef drop-off with mantas + glowing fluorescent coral + sunset-blasting godrays piercing turquoise depths
- Multi-story reef cross-section + fish at every level + bioluminescent particulate + impossible color stacking
- Reef visible through impossibly clear surface + storm-wall and rainbow above + sunlit foreground coral
- Parrotfish grazing through coral gardens + electric-blue plankton clouds + sunbeam shafts piercing thick particulate
- Staghorn thickets with damsels darting + visible sky-storm refraction patterns + bioluminescent foreground
- Reef flat with turtles and surgeonfish + caustic light + magenta sunset reflecting on surface above

━━━ RULES ━━━
- MAX abundance — many species per scene, density is the art
- Multiple coral types visible per entry
- 3+ stacked phenomena per entry (godrays + caustics + bioluminescence + saturated color + impossible scale + atmospheric particulate)
- Sunbeams, particulate, shallow warm water energy
- No repeats — every entry a unique reef moment
- Vivid, specific language — not generic "beautiful reef"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
