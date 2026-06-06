#!/usr/bin/env node
/**
 * DINO_DIORAMA_BIOME — the sculpted-clay prehistoric environment
 * that the toy dinos stand IN. Sculpted clay terrain + atmosphere:
 * jungle / swamp / desert / glacier / volcanic field / mushroom
 * forest / shoreline / canyon — every entry visibly handmade clay.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_biome.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CLAY BIOME entries for ToyBot dino-diorama — the handmade sculpted-clay prehistoric ENVIRONMENT that toy dinosaurs adventure through. Each entry is one descriptive line, 30-50 words, naming the biome and packing it with sculpted-clay texture detail.

━━━ THE BAR ━━━
Every entry names ONE biome type + 4-7 sculpted-clay material details (thumbprinted, tool-carved, rolled, pinched, pressed, finger-smoothed, scored). The CLAY material is named explicitly. The biome reads as a populated, richly-detailed prehistoric world — never empty or sparse. Colors are specific (ochre / sage / cobalt / cream / rust / olive / slate / sienna).

━━━ FORMAT (mirror this register) ━━━
"<Biome name>: <4-7 clay detail clauses, comma-separated>, <closing atmospheric note>."

Examples:
"Towering sequoia grove: colossal ribbed clay trunks in burnt sienna, thumbprinted bark texture, enormous root buttresses humping the forest floor, scattered clay fern fronds, deep shadow pockets between trunks, layered canopy silhouettes overhead."
"Layered badlands hoodoos: tall tapered clay spires in banded ochre, rust and cream, tool-carved horizontal strata lines, crumbling ledges, loose clay pebble scree at bases, a vast dry sky-open plateau stretching behind."
"Glowing mushroom forest: bulbous clay caps in cobalt and violet, stippled gills underneath, clusters at varied heights, luminous pale stalks, soft clay moss carpeting the ground, dense mycelium ridges threading between stems."
"Broad mirror lake: smooth pressed clay basin in slate-blue, ringed by sculpted muddy shoreline with thumb-pushed ripple marks, low rounded clay hills behind, tall horsetail reeds in clusters of rolled clay rods along the bank."

━━━ VARIETY MANDATE (distribute across these biome categories) ━━━
- ~5 PREHISTORIC JUNGLE / FOREST (tree-fern jungle / cycad forest / amber-pine wood / redwood grove / ginkgo grove / dense canopy / petrified-wood forest)
- ~3 SWAMP / WETLAND (bog / cypress swamp / mangrove flat / muddy delta / lily-pad marsh / steaming geothermal swamp)
- ~3 DESERT / BADLANDS (badland hoodoos / cracked dry flat / red-rock canyon / dune sea / mesa plateau / scrub flat)
- ~3 VOLCANIC TERRAIN (cooled lava field / black ash plain / pumice slope / steaming hot-spring field / sulphur flat / cinder slope)
- ~2 GLACIAL / TUNDRA (frozen tundra / snow-dusted plain / ice field / glacier toe / blue-glacier basin)
- ~2 LAKE / RIVER / SHORE (broad mirror lake / wide river bend / pebble shore / boulder-strewn shoreline / waterfall basin)
- ~2 MEADOW / FERN-CARPET (flowering meadow / open fern carpet / horsetail meadow / clover-clay flat)
- ~2 MOUNTAIN / RIDGE (mountain ridge / alpine col / craggy peak base / rocky escarpment / dragon-back ridge)
- ~2 MUSHROOM / BIOLUMINESCENT (glowing mushroom forest / bioluminescent fern hollow / glow-bug meadow / phosphorescent moss flat)
- ~1 COASTAL / MARINE (rocky tide-pool shore / kelp-strewn beach / sea-cliff edge / coral-clay shallows)

━━━ BANS ━━━
- NO dinosaurs in this axis — biome only.
- NO modern objects.
- NO photoreal landscape language — every entry is HANDMADE CLAY. Name it.
- NO single-detail entries — pack 4-7 comma-separated clauses.
- NO repeating the same biome subtype across entries (one tar pit total, one mushroom forest total, etc.).
- NO bare "lush jungle" — front-load the biome name with the punchy descriptor (e.g., "Towering tree-fern jungle:").

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
