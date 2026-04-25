#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/luminous_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LUMINOUS LANDSCAPE descriptions for EarthBot — scenes where LIGHT is the true subject, transforming ordinary terrain into something transcendent.

Each entry: 15-25 words. One specific landscape transformed by extraordinary light. No people.

━━━ CATEGORIES (mix across all) ━━━
- God-rays through forest mist (shafts of morning light piercing redwood canopy, beams in birch fog)
- Golden hour raking ridgelines (last light scraping across mountain faces, long shadows on dunes)
- Moonlit silver on still water (full moon reflected in glassy lake, moonpath on calm ocean)
- Aurora over glaciers (green curtains dancing above blue ice, aurora reflected in glacial meltwater)
- Backlit autumn leaves (sun behind translucent maple canopy, amber light through beech forest)
- Dawn mist on lakes (pink light dissolving lake fog, mirror reflections in pre-dawn stillness)
- Storm break light (single sunbeam through dark storm clouds onto meadow, dramatic chiaroscuro)
- Alpenglow (pink-purple light on snow peaks after sunset, rose-tinted summits at last light)
- Underwater light shafts (sunbeams penetrating clear cenote water, light columns in shallow reef)
- Rim lighting on landscapes (backlit grass seed heads, haloed tree silhouettes, lit cliff edges)
- Reflected light bouncing (canyon walls glowing from reflected creek light, ice cave light bounces)
- Twilight glow (deep blue hour light on snow, purple twilight over volcanic landscape)

━━━ RULES ━━━
- LIGHT is the protagonist — the landscape serves the light, not the other way around
- Describe both the light quality AND how it transforms the scene
- Real lighting phenomena only — no fantasy glow or magical light
- No two entries should use the same light type on the same terrain
- 15-25 words each — luminous, reverent, painterly language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
