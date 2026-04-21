#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/biomes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BIOME descriptions for EarthBot — specific Earth biomes with characteristic flora / terrain / atmospheric signature. Used to ground any render in a real-world ecological context.

Each entry: 10-20 words. One specific biome with 2-4 identifying details.

━━━ CATEGORIES ━━━
- Alpine (treeline + dwarf-conifers + scree + wind-stunted growth)
- Tundra (permafrost + low lichens + cotton-grass + aurora-capable)
- Boreal / taiga (spruce-fir + birch + peat bogs + long twilight)
- Temperate rainforest (old-growth + heavy moss + ferns + near-constant mist)
- Temperate deciduous (oak + maple + hickory + autumn-color variance)
- Pine forest (ponderosa / lodgepole + needle carpet + filtered sun)
- Mediterranean (olive + rosemary + cork-oak + dry rocky soil)
- Tropical rainforest (buttressed trees + lianas + constant humidity + emerald canopy)
- Cloud forest (mid-elevation tropical + mist + epiphytes + tree-ferns)
- Mangrove (coastal tropical + saltwater + stilt-roots + slow currents)
- Savanna (grassland + acacia + dry-wet seasonal + golden light)
- Prairie / steppe (tallgrass + sweeping horizons + wind-rippled grass)
- Desert (sand sea + dune + scrub + extreme-temperature swings)
- Saguaro / cacti desert (Sonoran style + tall columnar cacti + red earth)
- Salt flat (playa + salt-crust + hexagonal cracks + horizon-line)
- Coastal dune (marram-grass + sand + salt-spray + driftwood)
- Rocky intertidal (tide pools + kelp + barnacle-crust + sea-stacks)
- Coral reef (emerging from water — tropical + rocky islets + turquoise water)
- Volcanic (lava-field + pumice + ash + cooling cones)
- Glacier / ice cap (blue crevasse + ice-field + moraine + meltwater)
- Riparian (river-corridor + willow + cottonwood + gravel bar)
- Wetland / bog (sphagnum + pitcher-plants + standing water + reflections)
- Karst (limestone-tower + sinkhole + cave entry + underground rivers)

━━━ RULES ━━━
- Real Earth biomes only
- Include flora/terrain/atmospheric signatures specific to the biome
- NO fantasy biomes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
