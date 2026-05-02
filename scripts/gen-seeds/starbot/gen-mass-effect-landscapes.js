#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/mass_effect_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MASS-EFFECT-CODED LANDSCAPE entries for StarBot's mass-effect-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC ALIEN VISTA in the Mass Effect aesthetic tradition — rotating space-station arms enclosing a habitat-galaxy, volcanic clan-warrior wastelands, floating-architecture goddess-worlds, biomechanical Reaper-coded ship-architecture, geth-tech industrial planets, asari floating crystalline cities, krogan ravaged badlands.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO ALIENS, NO REAPERS-AS-FOREGROUND-CHARACTERS. Pure landscape only (Reaper-style biomechanical ARCHITECTURE in the distance OK as silhouette).

CRITICAL — NO PROPER NOUNS. Never write "Citadel", "Tuchanka", "Thessia", "Reaper", "Sovereign", "Geth", "Quarian", "Krogan", "Asari", "Salarian", "Cerberus", "Normandy", "Mass Effect" — describe the AESTHETIC generically. Use phrases like "rotating five-arm habitat station interior", "volcanic clan-warrior wasteland", "crystalline floating-city", "biomechanical Reaper-style capital ship", "geth-platform industrial moon".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of BioWare-Mass-Effect concept-art / Sparth / Matt-Rhodes. CLEAN-FUTURE technology meets DISTINCT-ALIEN-ESTHETICS. Each species/world has its own architectural language: floating-crystalline (asari elegance), brutal-industrial-volcanic (krogan), biomechanical-organic (reaper), geometric-platform (geth), curved-classical (citadel), ringed-station habitats. Color palettes are CONTROLLED and ELEGANT — controlled blues, controlled oranges, controlled purples, never gaudy.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

ROTATING ARM-STATION INTERIORS (~4):
- view down the curving arm of a vast rotating space station, lush parks and skyscrapers along the arc, opposing arm visible across the void
- inside a rotating-station arm at sunset, billion-year garden parks visible curving overhead, interior of a galactic-capital habitat-ring
- between-arm void of a five-arm rotating habitat station, opposing arms catching the light from a distant star

VOLCANIC CLAN-WARRIOR WASTELANDS (~3):
- volcanic-ravaged plains under blood-red sky, scattered shanty fortresses and ruined ancient-empire structures, ash drifting
- clan-warrior badlands with broken cliff-citadels, lava-vein cracks across the rust-orange ground, scattered mech wrecks
- post-apocalyptic clan-territory with volcanic geysers, abandoned bunker silhouettes, lone shrine-rock against red sky

CRYSTALLINE FLOATING-CITY (~3):
- floating crystalline elf-architecture city suspended above an ocean planet, slim spires, classical-elegant proportions
- ancient floating-city of crystal-and-ivory, soft violet ambient light, suspended over reflecting waters
- crystalline goddess-temple city floating in pastel cloud-cover, ornate organic-gothic spires

BIOMECHANICAL REAPER-STYLE CAPITAL SHIP (~3):
- distant silhouette of a kilometer-tall biomechanical capital ship descending toward a planet, atmospheric burn-glow surrounding it
- crashed Reaper-style ancient bio-mech vessel half-buried in a desert plain, segmented tentacle-legs jutting up
- biomechanical capital ship hovering over a city, claws gripping the skyline, deep-shadow ominous

GETH-TECH INDUSTRIAL MOON (~3):
- geth-platform industrial moon with smooth chrome architecture, exposed cabling, flat synthetic-aesthetic surfaces
- synthetic-collective platform city, geometric chrome buildings without organic curves, sterile blue ambient
- machine-civilization industrial colony, modular prefab-platform aesthetic, single huge optical lens visible at distance

ASARI-CLASSICAL ARCHITECTURE (~2):
- floating-temple-city of pastel-violet stone with arched doorways and elegant minarets, ocean horizon
- ancient asari-style temple complex on a cliffside, ivory columns and pastel-purple stained glass

KROGAN RAVAGED BADLANDS (~2):
- post-nuclear barren wastelands with skeleton-buildings of a dead civilization, ruined statues, dust-storm horizon
- ravaged hostile plain with cracked obsidian rock, ancient megalithic ruins half-buried, hostile sun

CITADEL-CURVED CLASSICAL (~2):
- vast curved metallic interior of a galactic-capital station, multi-tier promenade with skybridges
- elegant curved-classical chamber inside a habitat-station, polished floor reflecting elegant chrome architecture

PLANET-SURFACE COLONIES (~3):
- prefab colony town on a desert planet, modular structures with controlled-blue lighting, atmospheric processor in distance
- frontier outpost on an ice-world, geodesic dome habitats clustered around a power core, snow drifting between
- volcanic-coast colony with prefab housing, lava-glow on the horizon, controlled-orange emergency lighting

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO aliens-as-figures
- NO franchise proper nouns
- Mood is CLEAN-FUTURE meets DISTINCT-ALIEN — controlled palettes, never gaudy
- Variety across the 9 categories above mandatory
- Cinematic / cosmic scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
