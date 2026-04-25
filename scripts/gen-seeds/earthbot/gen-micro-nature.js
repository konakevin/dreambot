#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/micro_nature.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EXTREME MACRO CLOSE-UP descriptions for EarthBot — nature at tiny scale, where mundane details become entire worlds of texture, pattern, and light.

Each entry: 15-25 words. One specific macro/close-up natural subject. No people, no animals as subjects.

━━━ CATEGORIES (mix across all) ━━━
- Dewdrops refracting light (sunrise refracted in dew on petals, water beads on grass blades)
- Frost crystals (ice patterns on windows, hoarfrost on spider webs, frozen breath crystals)
- Lichen patterns (crustose lichen on granite, foliose rosettes, lichen color mosaics on bark)
- Moss forests at ground level (sporophyte stalks, moss canopy from ant perspective, wet moss glow)
- Ice crystal formations (needle ice, fern frost, ice flowers on thin ice, frozen bubble columns)
- Seed pods and dispersal (dandelion clock backlit, milkweed silk, maple samaras, poppy pods)
- Mushroom gills and caps (underside gill patterns, spore release, dew on mushroom caps, mycelium)
- Fern spirals unfurling (fiddlehead coils, frond fractal patterns, new fern growth backlit)
- Bark textures (peeling birch bark, deeply furrowed oak, paperbark layers, sycamore puzzle bark)
- Mineral crystals (quartz points, mica sheets, pyrite cubes, calcite rhombs in natural setting)
- Petal textures (rose petal veins, lily throat patterns, translucent poppy petals backlit)
- Water surface tension (water strider dimples, raindrop crowns, surface film iridescence)

━━━ RULES ━━━
- MACRO SCALE — viewer is inches from the subject, seeing details invisible to casual observation
- Emphasize texture, pattern, light interaction, and the hidden beauty of small things
- Real natural subjects only — no fantasy micro-worlds
- Mix wet/dry, warm/cold, living/mineral subjects across entries
- No two entries should describe the same subject type with the same light
- 15-25 words each — precise, intimate, wonder-filled language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
