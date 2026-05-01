#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/lost_city_scenes.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LOST CITY scenes for OceanBot's lost-cities path. Each entry is one cinematic underwater scene of a sunken civilization — Atlantis-style ruins, drowned temples, coral-grown statues of forgotten gods, "the ocean is swallowing civilization."

Each entry: 15-25 words. ONE specific dramatic moment.

━━━ SUBJECTS — ONLY THESE ━━━
- Atlantis-style sunken city ruins, marble columns rising from sand, fallen pediments
- Drowned temples — sunken Greco-Roman / Egyptian / Mesoamerican / Mesopotamian / Hindu / Khmer architecture
- Coral-grown statues of forgotten gods — Poseidon, Buddha, Apollo, Anubis, Quetzalcoatl, Vishnu, Shiva — encrusted with reef life, fish nesting in mouths and eyes
- Drowned palaces — throne rooms with kelp tapestries, ballrooms with coral chandeliers
- Submerged ziggurats / pyramids / pagodas / step-pyramids consumed by the sea
- Sunken aqueducts, drowned amphitheaters, flooded forums
- Glyphs / hieroglyphs / cuneiform / runes barely visible through algae
- Sacred mosaics on the sea-floor still legible after centuries
- Drowned libraries — clay tablets and stone scrolls scattered in silt
- Massive arches, gateways, colonnades, processional avenues swallowed by the deep
- Drowned harbor walls and lighthouses, Pharos-style towers half-toppled

━━━ ABSOLUTELY BANNED ━━━
- NO modern ships, submarines, scuba gear, divers, humans
- NO sea monsters, krakens, sea serpents, leviathans (those are kraken-leviathan path)
- NO mermaids (mermaid-legend path)
- NO wooden sailing ships (those are ghost-ship and shipwreck-kingdom)
- NO modern infrastructure — bridges, highways, skyscrapers, oil rigs
- NO modern statues — only ancient / mythological / pre-1500 forgotten-god statues

━━━ ATMOSPHERE / RENDER VIBE ━━━
- Turquoise haze suspended through the water column
- Shafts of god-rays piercing from above
- Coral-grown statues with anemones in eye sockets
- Reef life nesting in temple windows
- Haunting beauty — civilization consumed by ocean
- Silt drifting around fallen pediments
- Schools of fish swirling through arches
- Bioluminescent moss crawling up sunken pillars

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Marble Atlantis colonnade rises through turquoise haze, coral-encrusted Corinthian capitals haloed by god-rays, parrotfish drifting between fluted columns"
- "Coral-grown Poseidon statue stands waist-deep in silt at the drowned plaza, anemones blooming from his trident, schools of jacks orbiting his bearded head"
- "Sunken Khmer temple stair-pyramid rises from kelp forest, ancient apsara reliefs softened by century of barnacles, octopus nesting in the stone goddess's open mouth"
- "Pharos lighthouse half-toppled into the lost harbor, marble fragments scattered across coral-paved breakwater, light filtering down through schools of silver baitfish"

━━━ RULES ━━━
- SCALE — these are ancient civilizations dwarfing reef life and divers' imaginings
- HAUNTING beauty, not horror — civilization swallowed by beauty itself
- Specificity — name the architectural style, the deity, the era
- Mix civilizations across entries — Greek / Egyptian / Mesoamerican / Khmer / Hindu / Mesopotamian / Polynesian / Lemurian
- Reef life as the "now" colonizing the "then"
- No modern subjects whatsoever

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
