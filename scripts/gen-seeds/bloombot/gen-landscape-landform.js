#!/usr/bin/env node
/**
 * BLOOMBOT_LANDSCAPE_LANDFORM — monumental landforms hosting a
 * superbloom. Glacial cirques, sea-cliff headlands, volcanic calderas,
 * Tibetan high-plateau, badlands washes, alpine ridge-lines, oxbow
 * bends, Andean altiplano. Each is a hero landscape stage.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_landscape_landform.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LANDFORM entries for BloomBot's landscape path — wide monumental natural landforms hosting a superbloom / wildflower carpet. Each entry is one descriptive line, 35-55 words, starting with a CAPS NAME, em-dash, then body describing the landform's geology, scale, depth-layers, and how the bloom-carpet sits on it.

━━━ THE BAR ━━━
Every entry names a SPECIFIC GLOBAL landform type that hosts wildflowers naturally. Glacial cirque, sea-cliff headland, volcanic caldera, alpine plateau, badlands wash, ridge-line traverse, oxbow bend, altiplano, fjord, escarpment, mesa, etc. Each must NAME the geology + structural scale + how the bloom-carpet drapes across it + multi-tier depth (foreground / midground / background features).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"GLACIAL CIRQUE BOWL IN FULL SUPERBLOOM — semi-circular alpine amphitheatre carved by ancient ice, sheer granite walls rising three hundred metres on three sides, meltwater tarn at centre reflecting the sky"
"SEA-CLIFF HEADLAND BLOOM-TURF — wave-hammered Atlantic promontory where bloom-turf sweeps unbroken from foreground edge to sheer drop, white surf detonating against black-basalt base far below"
"VOLCANIC CALDERA SUPERBLOOM — vast circular caldera floor detonating in pioneer blooms after seasonal rains, raw black-lava crater-rim ringing the entire horizon, ash-cone rising at the far edge"
"TIBETAN HIGH-PLATEAU BLOOM-BELT — immense high-altitude plateau rolling to the limits of perception, bloom-belt carpeting the valley floor and lower terraces, snow-capped seven-thousand-metre ridgelines"
"BADLANDS WASH SUPERBLOOM — once-a-decade superbloom deluging the gulches between pink-and-amber strata buttes, dry stream-bed snaking a pale thread through the foreground bloom-carpet"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 ALPINE / MOUNTAIN (glacial cirque, alpine ridge, mountain saddle, hanging valley, scree slope, alpine meadow bowl)
- ~4 COASTAL / SEA-EDGE (sea-cliff headland, dune-rim coastline, fjord-mouth meadow, barrier-island, salt-marsh edge, lagoon-fringe)
- ~3 VOLCANIC (volcanic caldera, lava-field flowers, ash-cone slope, fumarole basin, lava-tube collapse-bowl)
- ~3 PLATEAU / HIGH STEPPE (Tibetan high-plateau, Andean altiplano, African inselberg savanna, Mongolian steppe, Patagonian meseta)
- ~3 BADLANDS / DESERT (badlands wash, painted-desert mesa, hoodoo basin, sandstone slot canyon bloom, alkali-flat fringe)
- ~3 RIVER / WATERWAY (oxbow river bend, braided-river bloom-island, gorge-rim bloom-shelf, delta marsh, glacial-melt river meadow)
- ~3 WETLAND (bog superbloom, fen-grass bloom flats, river-flood meadow, blackwater swamp bloom, peat-flat bloom)
- ~3 RIDGE / ESCARPMENT (alpine ridge-line traverse, sandstone escarpment shelf, basalt cliff-top, mesa-rim, plateau scarp)
- ~3 BASIN / VALLEY (rift-valley basin, glacial U-valley, geothermal basin meadow, polje sinkhole basin, doline depression)
- ~3 ARCTIC / ICE-EDGE (tundra bloom-tundra, polar-summer arctic meadow, ice-edge bloom-fringe, permafrost polygon meadow)
- ~3 ISLAND / ATOLL (volcanic island summit, coral atoll motu, sub-antarctic island bog, sea-stack top, fjord-island)
- ~3 FOREST-EDGE (forest meadow clearing, beaver-meadow basin, alpine-treeline bloom-flat, savanna woodland edge, riparian gallery meadow)
- ~3 HIGH-DESERT / SAVANNA (Sonoran superbloom, Namib bloom-flat, Patagonian steppe bloom, Kalahari pan after rain, Atacama once-a-decade bloom)
- ~3 KARST / LIMESTONE (karst polje, dolina sinkhole, limestone pavement bloom, gorge meadow, sinkhole-floor bloom)

━━━ BANS ━━━
- NO photographer-name drops (no Marc Adamus / no Peter Lik / etc.).
- NO bare "mountains and flowers" — name the GEOLOGY type + scale + bloom-arrangement.
- NO sci-fi / no neon / no hologram.
- NO indoor or interior scenes — this is OUTDOOR landscape only.
- NO mountain-photographer travel-magazine register ("Dolomites grandeur", "Pulitzer gravitas") — name the real LANDFORM.

━━━ FORMAT ━━━
Each entry: 35-55 words. Format: "NAME CAPS — body text naming the landform + geology + scale + how the bloom-carpet sits on it + multi-tier depth".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
