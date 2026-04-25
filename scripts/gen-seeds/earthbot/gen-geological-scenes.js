#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/geological_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GEOLOGICAL SPECTACLE descriptions for EarthBot — raw Earth geology at its most visually stunning, showcasing the planet's deep-time sculptural power.

Each entry: 15-25 words. One specific geological scene. No people.

━━━ CATEGORIES (mix across all) ━━━
- Crystal caves (Naica-style giant selenite crystals, amethyst geodes, quartz caverns, crystal grottos)
- Basalt columns (Giant's Causeway hexagonal columns, Svartifoss pillars, columnar jointing cliffs)
- Slot canyons with light beams (Antelope Canyon shafts, narrow sandstone corridors, wave-carved slots)
- Erupting geysers (Strokkur eruption, Old Faithful column, geyser steam at dawn, boiling mud pots)
- Lava tubes and tunnels (hollow lava corridors, lava tube skylights, frozen lava formations)
- Travertine terraces (Pamukkale white terraces, Mammoth Hot Springs, mineral-deposited pools)
- Glacier ice caves (blue ice tunnels, glacier moulin shafts, ice cave with river running through)
- Obsidian fields (volcanic glass flows, obsidian cliffs, rainbow obsidian exposed faces)
- Salt flats (Salar de Uyuni mirror reflections, Bonneville cracked polygons, salt crystal formations)
- Hoodoo formations (Bryce Canyon spires, Cappadocia fairy chimneys, eroded sandstone pillars)
- Volcanic landscapes (fresh lava flows, volcanic craters, cinder cones, pumice fields)
- Fossil-rich exposures (cliff faces with visible strata, petrified forests, exposed geological layers)

━━━ RULES ━━━
- GEOLOGY is the subject — rock, mineral, crystal, lava, ice, salt, sediment
- Emphasize texture, color, formation, and deep-time sculptural quality
- Real geological formations amplified for maximum visual drama
- Mix underground, surface, and exposed geological features across entries
- No two entries should describe the same formation type in the same region
- 15-25 words each — elemental, ancient, monumental language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
