#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/starwars_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} STAR-WARS-CODED LANDSCAPE entries for StarBot's starwars-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC ALIEN PLANET VISTA in the Star Wars aesthetic tradition — twin-sun deserts, ice-plain wastelands, redwood forest moons, gas-giant cloud-cities, ocean-storm platforms, lava-river hellscapes, jungle-canopy canopy-worlds, junkyard-shipwreck deserts, ringed gas-giant skies, classical lake-country, megalopolis cityscape skyscapes.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO DROIDS, NO SPACESHIPS-AS-FOREGROUND-SUBJECTS, NO LIGHTSABERS. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Tatooine", "Coruscant", "Hoth", "Endor", "Naboo", "Mustafar", "Kashyyyk", "Jakku", "Kamino", "Bespin", "Jedi", "Sith", "Empire", "Rebellion", "Death Star" — describe the AESTHETIC generically. Use phrases like "twin-sun desert", "redwood forest moon", "ice plains under sub-zero sun", "gas-giant cloud-platform city", "lava-river volcanic hellscape".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of George-Lucas / Ralph-McQuarrie concept-art / Doug-Chiang / 70s-pulp-sci-fi-paperback / matte-painting tradition. Lived-in, dirty-future, used-cosmos. Painted backdrops with grand cinematic scale. Distinct CLIMATE per world — every entry should clearly read as ONE specific iconic-coded biome.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

TWIN-SUN DESERT WORLDS (~4):
- vast amber desert under twin suns at the horizon, wind-carved rock formations, distant moisture-farm silhouettes (no people)
- sandstone desert with binary-star light, rocky escarpment, abandoned moisture-farm structures in the middle distance

ICE-PLAIN WASTELANDS (~3):
- frozen tundra under pale sub-zero sun, scattered ice-formations, distant mountain peaks
- snow-blasted polar desert with ice canyons, low sun, blowing crystal-snow

REDWOOD-FOREST MOONS (~3):
- ancient towering redwood-canopy forest, dappled green light filtering through massive trunks, fern undergrowth
- forest moon at dusk with kilometer-tall trees, vine-bridges between trunks, distant gas-giant in the sky

GAS-GIANT CLOUD-CITIES (~3):
- floating cloud-city platform suspended in pastel-orange gas-giant atmosphere, classical-curved architecture
- aerial platform city in upper atmosphere of a banded gas giant, sunset glow, classical white architecture

CLASSICAL LAKE-COUNTRY (~2):
- rolling green hills with sparkling lake, classical-future palace architecture, waterfalls cascading from cliffs
- pastoral lake-country with elaborate domed pavilions, manicured gardens, distant snow-capped mountains

OCEAN-STORM PLATFORMS (~2):
- vast stormy ocean planet with rain-lashed elevated platforms, tropical-storm sky, breaking waves below
- sea-platform colony in perpetual storm, lightning illuminating distant cloud-banks

LAVA-RIVER HELLSCAPES (~2):
- volcanic hellscape with lava rivers flowing across obsidian plains, sulfur sky, glowing magma-falls
- lava-planet landscape with broken obsidian terrain, volcanic vents, dim red atmospheric glow

CITY-PLANET SKYSCAPE (~2):
- endless megacity skyscape stretching to horizon, billion-window towers, layered sky-traffic lanes
- urban-canyon view between kilometer-tall towers, atmospheric haze, distant elevated freeway

JUNKYARD-SHIPWRECK DESERT (~2):
- desert plain littered with crashed-spacecraft hulks, sand-buried wreckage, scavenger encampment silhouettes (no people)
- shipwreck-graveyard plateau with downed star-destroyer-style hulls half-buried, dusty haze

JUNGLE-CANOPY WORLDS (~2):
- dense jungle moon with thick humid canopy, hanging vines, ancient stone temple ruins overgrown
- temple-overgrown jungle plateau, massive ziggurat half-revealed by foliage, distant ringed planet

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO droids / NO spaceships as foreground subject (background silhouettes OK at distance)
- NO franchise proper nouns
- Strong climate / sky / atmosphere component
- Variety across the 10 categories above mandatory — minimum 2 per major biome
- Lived-in, dirty-future, used-cosmos mood — Ralph McQuarrie / matte-painting tradition
- Cinematic scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
