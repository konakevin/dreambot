#!/usr/bin/env node
/**
 * EarthBot epic-vista — SUBJECT axis (BIOME-TAGGED for compositional consistency).
 *
 * Each entry = ONE real Earth location, geography + geology + scale only,
 * with biome tag(s) so the composer can dynamically filter the foreground
 * anchor pool to match. R1 update (2026-05-20): tagged object format.
 *
 * Biome tag vocabulary (8 categories, used across all EarthBot axes):
 *   alpine             — high mountain peaks, granite, snow/ice fringe, treeline
 *   arctic-polar       — polar ice cap, polar ocean, true tundra, ice shelf
 *   desert             — sand dunes, sandstone canyon, badlands, dry plateau
 *   coastal-temperate  — cool sea cliffs, fjord, basalt coast, kelp coast
 *   coastal-tropical   — palm beach, reef coast, mangrove, tropical lagoon
 *   temperate-forest   — old-growth conifer, redwood, deciduous, cool forest
 *   tropical-jungle    — Amazon / Borneo / true tropical rainforest
 *   volcanic           — fresh lava, ash, geothermal, active caldera
 *
 * Most subjects span 1-3 biomes (Patagonia = alpine + temperate-forest, etc.).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_subject.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} EPIC VISTA SUBJECT entries for EarthBot — each entry names ONE iconic real-world Earth landscape and tags it with biome category/categories so the composer can match a biome-appropriate foreground anchor.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<location + geology + scale, 18-30 words>" }

Biome tag vocabulary (use ONLY these 8 values — pick 1-3 per entry):
- "alpine" — high mountain peaks, granite spires, treeline, mountain snow/ice
- "arctic-polar" — polar ice cap, polar ocean, true tundra, ice shelf (genuinely treeless)
- "desert" — sand dunes, sandstone canyons, badlands, dry plateau
- "coastal-temperate" — cool sea cliffs, fjord, basalt coast, kelp coast (Norway, Iceland, BC, Faroe)
- "coastal-tropical" — palm beach, reef coast, mangrove, tropical lagoon (Hawaii, Maldives, Bali)
- "temperate-forest" — old-growth conifer, redwood, deciduous, cool forest
- "tropical-jungle" — Amazon, Borneo, true tropical rainforest
- "volcanic" — fresh lava, ash, geothermal, active caldera

Subjects that span multiple biomes get multiple tags. Examples:
- Torres del Paine → ["alpine", "temperate-forest"] (granite spires AND beech-forest fringe)
- Vatnajökull → ["arctic-polar", "coastal-temperate"] (ice cap dropping into fjord)
- Reynisfjara → ["coastal-temperate", "volcanic"] (basalt coast on volcanic island)
- Saharan dunes → ["desert"] (single tag)
- Napali coast → ["coastal-tropical", "tropical-jungle"] (cliff coast + jungle)
- Antarctic ice shelf → ["arctic-polar"]
- Kilauea lava flow → ["volcanic", "coastal-tropical"] (when meeting ocean)

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 18-30 words. ONE location. Describe:
- Location NAME (real specific place)
- Core geological character (granite spires / basalt columns / sandstone hoodoos / ice cap / hexagonal columns / star dunes / etc.)
- Scale character (vertical drop, breadth, depth — concrete physical scale)
- Base material/palette (charcoal-black sand / electric-blue ice / rust-red sandstone / cobalt water / lime-green moss)

WHAT TO EXCLUDE FROM DESCRIPTION (these go in OTHER axes, never in subject):
- NO weather (no storms, no clouds, no rain, no snow falling)
- NO lighting / time-of-day (no "golden hour", no "sunset", no "dawn", no "midnight sun")
- NO optical phenomena (no rainbows, no aurora, no sun-pillars, no halos)
- NO atmospheric effects (no fog, no mist, no haze, no spray)
- NO sky description (no cobalt sky, no mammatus clouds)
- NO scale-prover wildlife (no eagles, no goats — that's hero_feature axis)

━━━ EXAMPLES (study format + biome tagging) ━━━

✓ { "tags": ["alpine", "temperate-forest"], "description": "Torres del Paine in Patagonia: three granite spires rising sheer two-thousand meters from turquoise glacial lake, wind-scoured east faces, blue-grey ridges receding to horizon" }

✓ { "tags": ["arctic-polar", "coastal-temperate"], "description": "Vatnajökull Glacier in Iceland: ice cap stretching to horizon, electric-blue calving fronts dropping vertical into black volcanic-sand fjord, crevasse fields scoring the surface" }

✓ { "tags": ["coastal-temperate", "volcanic"], "description": "Reynisfjara in Iceland: hexagonal basalt column cliffs rising sixty meters from north-Atlantic shore, charcoal-black volcanic sand beach stretching wide, sea-stacks standing offshore" }

✓ { "tags": ["desert"], "description": "Namib Desert at Sossusvlei: thousand-foot rust-orange star dunes flanking bone-white cracked clay pan, shadow-striped ridgelines, apricot and deep-ochre sand walls" }

✓ { "tags": ["coastal-tropical", "tropical-jungle"], "description": "Napali Coast of Kauai: cathedral-tall emerald sea cliffs plunging two thousand feet into Pacific, ancient lava ridges thick with tropical jungle, hidden valleys" }

━━━ CATEGORY DISTRIBUTION (across ${n} entries — spread biomes intentionally) ━━━

- ~25% alpine (Patagonia / Himalayan / Karakoram / Alps / Dolomites / Sierra / Cascades / Andes / Atlas / Caucasus)
- ~15% coastal-temperate (Norwegian fjord / Faroe / Reynisfjara / Cliffs of Moher / Big Sur / Etretat / 12 Apostles / BC coast)
- ~12% desert (Sahara / Namib / Atacama / Sonoran / Wadi Rum / Death Valley / Salar de Uyuni / Painted Desert)
- ~12% arctic-polar (Antarctica / Greenland / Banff icefields / Lemaire Channel / Svalbard / Russian Arctic / Vatnajökull)
- ~10% temperate-forest (Hoh Rainforest / Olympic / Tongass / Smoky Mountains / Black Forest / Daintree edge / Tasmania)
- ~10% canyon/plateau (Grand Canyon / Bryce / Monument Valley / Zion / Plitvice / Jiuzhaigou / Antelope Canyon — usually "desert" tag)
- ~8% coastal-tropical (Napali / Bora Bora / Maldives / Whitehaven / Phi Phi / Seychelles)
- ~5% volcanic (Kilauea / Mount Bromo / Yellowstone hot springs / Stromboli / Whakaari / Iceland geothermal — often combined with another tag)
- ~3% tropical-jungle (Amazon / Borneo / Daintree interior / Congo / Yasuni)

NEVER repeat a location twice. Each entry is a UNIQUE real place. Many subjects span multiple biomes — tag accordingly.

━━━ HARD BANS ━━━

- NO sci-fi vocabulary ("alien", "otherworldly", "Pandora", "biomechanical")
- NO fantasy vocabulary ("enchanted", "magical", "mystical", "ethereal", "fairy")
- NO bioluminescent fungi / glowworms / phosphorescent anything
- NO multi-moons, NO twin-suns, NO floating-islands
- NO weather / lighting / atmospheric / phenomenon language in description

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS in the exact shape shown above. No preamble, no markdown code fences, no numbering. Just a clean JSON array starting with [ and ending with ].`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
