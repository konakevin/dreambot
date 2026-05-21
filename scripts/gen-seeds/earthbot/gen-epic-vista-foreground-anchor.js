#!/usr/bin/env node
/**
 * EarthBot epic-vista — FOREGROUND_ANCHOR axis (BIOME-TAGGED + tree boost).
 *
 * R1 update (2026-05-20): tagged object format. Composer filters this
 * pool to entries whose biome tags overlap with the rolled subject's
 * biome tags via matchTagsFromSlot. Guarantees biome-appropriate
 * anchors: NO palm trees in arctic scenes, NO Joshua trees in fjords.
 *
 * Tree categories explicit per biome (Kevin requested 2026-05-20):
 *   alpine            — bristlecone pine, krummholz spruce, subalpine fir, dwarf birch
 *   desert            — Joshua tree, saguaro, palo verde, ocotillo, desert ironwood
 *   coastal-temperate — Monterey cypress, wind-pruned Sitka spruce, wind-shorn madrone
 *   coastal-tropical  — lone palm, bent coconut, mangrove root system, screwpine
 *   arctic-polar      — NO TREES (genuinely treeless biome) — only ice/frost/lichen/tundra-flora
 *   temperate-forest  — cathedral redwood, Doug-fir, moss-draped maple, mossy hemlock
 *   tropical-jungle   — banyan, kapok, strangler fig, massive ceiba
 *   volcanic          — ohia, charred snag, iron-bark on lava, persistent koa
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_foreground_anchor.json',
  total: 50,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ANCHOR entries for EarthBot epic-vista — each entry names ONE specific NEAR-FRAME compositional anchor (the eye lands here first before traveling deep into the vista), tagged with the biome(s) it fits.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<near-frame anchor description, 15-25 words>" }

Biome tag vocabulary (use ONLY these 8 values — pick 1-3 per entry):
- "alpine" — high mountain, granite, snow-fringe, treeline (cool conifers, alpine wildflowers, lichened rock)
- "arctic-polar" — polar ice cap, polar ocean, tundra (NO TREES — genuinely treeless biome)
- "desert" — sand dunes, sandstone, badlands (Joshua tree, saguaro, palo verde, dry shrubs)
- "coastal-temperate" — cool sea cliffs, fjord, basalt coast (Monterey cypress, driftwood, wet basalt, tidepools)
- "coastal-tropical" — palm beach, reef coast (palms, coconuts, mangrove, screwpine, shells)
- "temperate-forest" — old-growth conifer, redwood, deciduous (cathedral fir/redwood, mossy logs, fern beds)
- "tropical-jungle" — Amazon-style true rainforest (banyan roots, kapok buttress, strangler fig)
- "volcanic" — fresh lava, ash, geothermal (ohia, charred snag, iron-bark, lava-glass shards)

Most anchors fit 1-2 biomes. Some can span more (e.g., "wind-bent juniper" works in alpine + desert; "lichened erratic boulder" works in alpine + arctic-polar + temperate-forest).

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 15-25 words. Describe:
- The specific element (cool-looking tree / lichened boulder / wildflower clump / driftwood / frost-feathers / etc.)
- Its size/scale (waist-high / car-sized / house-sized / patch / cluster / bed / scatter / lone / single)
- Material/texture/color detail (lime-green crustose lichen / pearl-grey weathered wood / glistening wet basalt / wind-twisted silver / etc.)
- Spatial placement cue (at frame edge / spanning lower foreground / immediate near-frame / etc.)

ONE element per entry. NEVER stack multiple foreground objects.

━━━ EXAMPLES (study format + biome tagging) ━━━

✓ { "tags": ["alpine"], "description": "Ancient bristlecone pine clinging to weathered limestone, twisted silver-grey trunk three thousand years old, anchoring the near-frame edge" }

✓ { "tags": ["desert"], "description": "Single Joshua tree silhouetted at the immediate foreground, spiked rosette crown raised toward sky, twisted bone-grey limbs" }

✓ { "tags": ["coastal-tropical"], "description": "Lone bent coconut palm leaning over the beach foreground, fronds combed by trade winds, slender trunk arcing toward water" }

✓ { "tags": ["coastal-temperate"], "description": "Wind-pruned Monterey cypress crown at cliff edge, branches all swept inland, silver-grey bark and emerald needle clusters" }

✓ { "tags": ["arctic-polar"], "description": "A patch of feathered hoar-frost crystallizing across volcanic-glass shards in the immediate foreground, glittering ice-white" }

✓ { "tags": ["temperate-forest"], "description": "Cathedral redwood trunk at frame edge, fluted bark furrowed deep ochre, twenty feet of girth visible, mossy understory at base" }

✓ { "tags": ["tropical-jungle"], "description": "Massive banyan tree at frame edge, cathedral root system curtaining downward, vines hanging in green tangles" }

✓ { "tags": ["volcanic"], "description": "Lone ohia tree persisting on the lava-rock foreground, crimson lehua blossoms blazing against charcoal-black aa lava" }

✓ { "tags": ["alpine", "arctic-polar"], "description": "Krummholz cluster of stunted spruce at treeline, contorted by decades of wind, spanning the near foreground" }

✓ { "tags": ["coastal-temperate"], "description": "Bare-bone driftwood arc bleached pearl-grey resting on cobbled beach foreground, sea-water-polished" }

✓ { "tags": ["alpine", "temperate-forest"], "description": "A car-sized glacial erratic furred with lime-green map-lichen and pale crustose patches, anchoring the lower-left foreground" }

✗ BAD — stacks multiple anchors: "Lichened boulder AND wildflower clump AND driftwood log together"
✗ BAD — wildlife: "Bald eagle perched on foreground rock" (wildlife is hero_feature axis)
✗ BAD — humans: "A hiker's worn boot prints in foreground" (NO HUMANS bot rule)
✗ BAD — structures: "Old wooden fence post in foreground" (NO STRUCTURES bot rule)
✗ BAD — biome mismatch: { "tags": ["arctic-polar"], "description": "Lone palm tree..." } (palm trees DO NOT exist in arctic biome)

━━━ CATEGORY DISTRIBUTION (across ${n} entries — STRONG TREE REPRESENTATION) ━━━

Cool trees / tree clumps as a foreground anchor are THE classic landscape-photography composition. ~50% of entries must feature trees (different species per biome — see breakdown below). Other categories: rock, water, frost, botanical-non-tree, organic detritus.

Per biome target (across ${n} entries):
- alpine (~9 entries): 5 trees (bristlecone / krummholz / subalpine fir / lone larch / wind-flagged whitebark) + 4 non-tree (lichened erratic / alpine tarn / wildflower meadow / talus shadow)
- desert (~7 entries): 4 trees (Joshua tree / saguaro / palo verde / ocotillo / desert ironwood / twisted juniper) + 3 non-tree (cracked clay polygon / sandstone shelf / sand-ripple / polished river-rock)
- coastal-temperate (~8 entries): 3 trees (Monterey cypress / wind-shorn Sitka spruce / wind-pruned madrone / ancient yew) + 5 non-tree (driftwood / wet basalt cobble / mussel-banded rock / sea-glass scatter / kelp tangle)
- coastal-tropical (~5 entries): 3 trees (lone bent palm / bent coconut palm / mangrove root system / screwpine) + 2 non-tree (white-sand foreground / conch shells / reef debris)
- arctic-polar (~5 entries): 0 trees (TREELESS) + 5 non-tree (hoar-frost on volcanic glass / pressure-ridge ice / iced-over puddle / snow scallop / lichen mat / dwarf willow tundra)
- temperate-forest (~7 entries): 4 trees (cathedral redwood / Doug-fir / moss-draped maple / mossy hemlock / cedar) + 3 non-tree (mossy fallen log / fern bed / mushroom cluster / dewy spiderweb)
- tropical-jungle (~5 entries): 3 trees (banyan / kapok buttress / strangler fig / massive ceiba) + 2 non-tree (jungle leaf litter / bromeliad cluster / hanging vine / fallen orchid)
- volcanic (~4 entries): 2 trees (lone ohia / persistent koa / iron-bark on lava) + 2 non-tree (pyroclastic crust polygons / obsidian shard / lichen-coated lava rock)

NEVER tag a palm tree as alpine. NEVER tag a bristlecone as tropical. Trees MUST match the biome they actually grow in.

━━━ HARD BANS ━━━

- NO HUMANS, NO HIKERS, NO BOOT PRINTS (bot rule)
- NO STRUCTURES — no fence posts, no cairns, no anything built
- NO STACKED multiple anchors per entry
- NO wildlife (separate axis — hero_feature)
- NO sci-fi / fantasy / magical / mystical descriptors
- NO bioluminescent moss / glowing fungi / phosphorescent anything
- NO weather descriptors (rain / wind direction etc. — atmosphere is separate axis)
- NO biome-impossible plants (palms in arctic, bristlecone in tropical, etc.)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS in the exact shape shown above. No preamble, no markdown code fences, no numbering. Just a clean JSON array starting with [ and ending with ].`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
