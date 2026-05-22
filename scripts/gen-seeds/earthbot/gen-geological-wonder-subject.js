#!/usr/bin/env node
/**
 * EarthBot geological-wonder — SUBJECT axis (R3 outdoor-pivot).
 *
 * R2 still produced 50% cave-tube renders because half the pool was
 * intimate-interior. Kevin's hearted batches are ALL outdoor geology
 * with depth + dramatic light (arches framing vistas, karst towers,
 * flowstone draping overhangs with landscape beyond).
 *
 * R3 SHIFTS to ~15% intimate / ~85% epic. The remaining 15% intimate
 * are "outdoor intimate" — close-ups of outdoor features that still
 * have multi-tier depth (foreground detail + midground + distant vista),
 * NEVER cave-interior chambers.
 *
 * Earth's raw geological architecture. ALL subjects render outdoors —
 * the viewer is always positioned outside, looking at the formation
 * with sky / vista / depth visible.
 *
 * R0 = 60 entries.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/geological_wonder_subject.json';
// R3 production scale — append to existing 60 entries to reach 200.
generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} GEOLOGICAL SUBJECT entries for EarthBot geological-wonder. Each entry describes ONE specific OUTDOOR geological feature — Earth's raw architecture as art, observed from outside with sky / vista / depth visible. Generic morphological descriptions only — NO named places (LESSON 7).

━━━ THE BAR — REAL EARTH OUTDOOR GEOLOGY AT 10/10 POSTER-PRINT TIER ━━━

Kevin's hearted batches are exclusively OUTDOOR geology with multi-tier depth — arches framing distant vistas, karst tower fields rising vertically, flowstone draping a desert overhang with mountains beyond. NEVER pure cave-interior chamber shots (Flux renders those as tube-shapes with bright openings). ALWAYS outdoor, ALWAYS with depth.

Each entry MUST establish:
- A geological formation as primary subject
- Multi-tier visual depth (foreground feature + midground + distant horizon or sky)
- An outdoor environment — sky, vista, valley, distance is ALWAYS visible

Marc Adamus / Peter Lik / Michael Kenna / Iurie Belegurschi gallery-print outdoor caliber.

━━━ CRITICAL POV RULE — OUTDOOR OBSERVATIONAL, NEVER INTERIOR ━━━

The viewer is ALWAYS outdoors looking at geological features. Even close-up "intimate" framings happen OUTSIDE — under an overhang with sky visible, at the base of a tower with the formation rising, viewing a geode exposed in a cliff face with landscape beyond.

✗ FORBIDDEN interior framings (cause cave-tube rendering):
- "cave chamber" / "cave interior" / "chamber walls"
- "tunnel" / "corridor" / "passage"
- "geode chamber" / "interior structure"
- "ceiling vaulting overhead" / "vaulted ceiling"
- "lava-tube ceiling" (when describing the inside)
- "subglacial chamber" / "ice cave interior"
- "phreatic cave passage"
- "interior bowl" / "interior cavity"
- "stalactite forest cave" (the WORD "cave" by itself)
- "amethyst-geode cleft" if it implies the viewer is inside
- ANYTHING that puts the viewer inside an enclosed space

✓ REQUIRED outdoor framings:
- "sandstone arch silhouetted against the sky"
- "karst-tower forest extending across the valley"
- "flowstone draping under a desert overhang with mountains beyond"
- "hoodoo amphitheater with spires rising"
- "salt flat stretching to the horizon"
- "geode crystals exposed in a fractured cliff face with distant valley beyond"
- "lava-flow field stretching across the volcanic plain"
- "balanced rock formation silhouetted against open sky"
- "eroded mesa rising in the distance"

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["intimate"], "description": "<outdoor close-up with depth, 22-38 words>" }
OR
{ "tags": ["epic"], "description": "<outdoor wide vista, 22-38 words>" }

The "tags" array MUST include exactly ONE of "intimate" or "epic" as the FIRST tag. Optional second tag for biome ("alpine" / "desert" / "volcanic" / "arctic-polar" / "temperate-forest" / "tropical-jungle" / "coastal").

━━━ INTIMATE SUBJECTS (~15% of entries — outdoor close-ups with depth) ━━━

Close-ups of outdoor features where the formation fills 50-70% of the frame AND there's still visible sky / vista / distance beyond. NEVER an enclosed interior.

- Calcite flowstone draping under a desert sandstone overhang, distant misty mountain ridges visible past the overhang ledge
- Mineral seep streaks running down a desert cliff face, layered hoodoo formations visible in the distance below
- Geode exposed in a fractured cliff face, druzy crystals catching light, valley extending in the distance beyond
- Single sandstone hoodoo close-up with eroded layers visible in detail, distant valley extending behind
- Petrified-wood log cluster scattered across a desert plain, mineral-replaced grain visible, mesa silhouettes in distance
- Iron-oxide-stained boulder cluster in the foreground, eroded badlands extending behind toward distant horizon
- Lava-cooled pahoehoe ropy surface texture in foreground, distant cinder cone visible at horizon
- Concretion-cluster spheres exposed on a windswept rock shelf, the open plain extending into deep distance behind
- Quartz vein exposed in a fractured rock outcrop, mountainous skyline visible in the deep background
- Frozen waterfall ice column on a vertical alpine cliff, distant snowfield extending behind beyond the rim

━━━ EPIC SUBJECTS (~85% of entries — outdoor wide vistas) ━━━

Wide-angle outdoor compositions. Multi-tier depth. The geological formation is the hero, set against open sky and vast distance. Vary aggressively across these categories:

DESERT / ARID:
- Sandstone arch silhouetted against an open dramatic sky, vast valley extending below
- Hoodoo amphitheater — vertical spire-clusters rising from a basin floor extending into deep distance
- Painted-desert badlands hills layered in striped color bands extending across the horizon
- Eroded sandstone-tower forest — clusters of weathered red-rock pillars across a wide valley
- Slot-canyon mouth opening into a broad desert plain, the narrow passage walls visible at frame edge
- Balanced-rock formation silhouetted against open sky, the wider plain extending below
- Yardang ridge field — wind-carved parallel rock fins extending across an arid plain
- Sandstone-wave formation — frozen-rippled stone curling in cross-bedded layers, distant horizon beyond
- Mesa tableland rising vertically from the surrounding plain, layered strata visible
- Wide canyon panorama with layered strata stepping down to a river far below

VOLCANIC:
- Hexagonal basalt-column coastline plunging into churning surf, vast ocean horizon beyond
- Fresh lava-flow field — amber-red lava channels through black solidified crust, distant cinder cone beyond
- Geyser-field plain with multiple steaming columns erupting against open sky
- Sulfur-pool plain with brilliant yellow rim and mineral-stained ground extending to distant volcanic peak
- Volcanic crater rim looking down across the steaming caldera floor with sky beyond
- Mud-volcano field with bubbling clay cones extending across the plain
- Pahoehoe-ropy lava plain stretching toward a distant volcanic ridgeline
- Obsidian outcrop face rising from a volcanic glass field, distant peaks visible

ALPINE / GLACIAL:
- Cascading travertine-terrace mountainside, mineral pools stepping below toward valley
- Glacier-margin fractured ice face with the wider alpine valley extending into the distance
- Frozen waterfall ice column on a vertical cliff with distant snowfield beyond
- Alpine karst tower field — sharp limestone pinnacles rising vertically from forested valley
- Hanging valley with a high cirque cliff face, snowfield extending toward distant peaks
- Moraine boulder field with a glaciated peak rising beyond

ARCTIC-POLAR:
- Iceberg cluster rising from arctic water, dramatic flat horizon extending behind
- Glacial calving face with broken ice in the foreground water, ice plain extending behind

TROPICAL / KARST:
- Limestone karst tower field rising vertically from a tropical-forest valley, sharp pinnacles dense
- Tufa-tower formation rising from a saline lake, distant volcanic ridge visible beyond
- Travertine-pool cascade in a tropical valley with surrounding jungle slopes
- Sea-stack pillars rising from a tropical coast with open ocean beyond

━━━ HARD BANS ━━━

NEVER include:
- **Named real-world places** (NO "Antelope Canyon" / "Bryce Canyon" / "Yellowstone" / "Crystal Cave" / etc — generic morphology only)
- **Interior framings** (NO "cave chamber" / "tunnel" / "passage" / "ceiling vaulting overhead" / "interior structure" / "subglacial chamber" — viewer is ALWAYS outdoors)
- Lighting words (no godrays / dappled / amber / sun-rays — that's the lighting axis)
- Atmospheric words (no mist / steam / dust beams — that's atmosphere axis)
- Mineral-color saturation (no "electric purple" / "neon" — mineral_color axis owns palette)
- Focal-anchor language (no "tree clinging" / "single waterfall thread" — focal_anchor axis)
- Humans / hikers / cavers / scale figures
- Buildings / railings / walkways / structures
- Sci-fi / fantasy / portal / glowing-magic
- Animals as primary subject
- Pure sky / cloud content (atmosphere handles that)
- Mention of "no humans" / "no figures" in the description itself

━━━ EXAMPLES ━━━

✓ { "tags": ["intimate", "desert"], "description": "Calcite flowstone draping under a sandstone overhang in the foreground, distant misty mountain ridges visible past the overhang ledge, layered strata extending into deep distance" }

✓ { "tags": ["intimate"], "description": "Geode crystals exposed in a fractured cliff face, druzy terminations visible in detail, valley extending into deep distance beyond" }

✓ { "tags": ["intimate", "alpine"], "description": "Frozen waterfall ice column on a vertical alpine cliff, distant snowfield extending behind beyond the rim, mountain peaks faintly visible" }

✓ { "tags": ["intimate", "desert"], "description": "Iron-oxide-stained boulder cluster in the foreground, eroded badlands extending behind toward distant horizon, layered striated formations beyond" }

✓ { "tags": ["intimate", "volcanic"], "description": "Pahoehoe-ropy lava cooled surface in the foreground close-up, fresh black crust folding in tight rope-furrows, distant cinder cone visible at the horizon" }

✓ { "tags": ["epic", "desert"], "description": "Sandstone arch silhouetted against a dramatic open sky, the natural span framing distant red-rock mesas, vast valley extending into deep distance" }

✓ { "tags": ["epic", "desert"], "description": "Hoodoo amphitheater — vertical spire-clusters rising from a basin floor, layered red-orange columns extending across the wide amphitheater into deep distance" }

✓ { "tags": ["epic", "tropical-jungle"], "description": "Limestone karst tower field — sharp pinnacles rising vertically from a tropical-forest valley below, dense vertical formations extending across the distance" }

✓ { "tags": ["epic"], "description": "Vast salt flat stretching to the horizon, hexagonal salt-crust patterns extending across the foreground, distant volcanic ridge silhouetted on the deep distance" }

✓ { "tags": ["epic", "volcanic"], "description": "Hexagonal basalt-column coastline plunging into churning surf, columnar joints clearly visible, vast ocean horizon extending beyond" }

✓ { "tags": ["epic", "desert"], "description": "Sandstone-wave formation — frozen rippled stone curling in cross-bedded layers, distant red-rock canyon extending into the deep horizon" }

✓ { "tags": ["epic", "alpine"], "description": "Cascading travertine-terrace mountainside, each turquoise mineral pool stepping below toward the valley floor extending behind" }

✓ { "tags": ["epic", "volcanic"], "description": "Fresh lava-flow field — amber-red lava channels through black solidified crust, distant volcanic peak rising at the horizon" }

✓ { "tags": ["epic", "volcanic"], "description": "Geyser-field plain with multiple steaming columns erupting against an open sky, mineral-crusted ground stretching across the foreground" }

✓ { "tags": ["epic", "desert"], "description": "Painted-desert badlands hills layered in striped color bands extending across the horizon, red-amber-purple sediment striations visible" }

✓ { "tags": ["epic", "desert"], "description": "Eroded sandstone-tower forest — clusters of weathered red-rock pillars extending across a distant valley, each tower silhouetted clearly" }

✓ { "tags": ["epic", "desert"], "description": "Yardang ridge field — wind-carved parallel rock fins extending across an arid plain, the fin-tops catching light, distant horizon visible" }

✓ { "tags": ["epic", "desert"], "description": "Mesa tableland rising vertically from the surrounding desert plain, layered strata visible in the face, distant horizon extending wide" }

✓ { "tags": ["epic"], "description": "Wide canyon panorama with layered strata stepping down to a river far below, distant canyon walls extending into deep haze" }

✓ { "tags": ["epic", "tropical-jungle"], "description": "Tufa-tower formation rising from a saline lake, mineral-spire cluster reflected in the still water, distant volcanic ridge silhouetted beyond" }

✗ BAD — interior: "Stalactite forest cave with densely packed calcite spears hanging from the vaulted ceiling" (BANNED — cave interior triggers tube rendering)
✗ BAD — interior: "Lava-tube collapse exposing the chamber below" (BANNED — chamber framing still triggers cave-tube)
✗ BAD — interior: "Glacier-margin fracture exposing a deep interior ice chamber" (BANNED — "interior chamber" triggers tube)
✗ BAD — named place: "Antelope Canyon slot canyon" (BANNED — say "narrow sandstone slot canyon")
✗ BAD — lighting: "Cave with godrays piercing through" (BANNED — lighting axis owns light)
✗ BAD — atmosphere: "Geyser field with steam billowing" (BANNED — atmosphere axis owns mist/steam)
✗ BAD — saturation: "Electric-neon crystal cave" (BANNED — real mineral colors only)

━━━ SCALE DISTRIBUTION (R3 outdoor-pivot) ━━━

- ~15% intimate (outdoor close-ups with depth: flowstone-under-overhang, geode-in-cliff, frozen-waterfall, pahoehoe-detail, mineral-seep-on-cliff)
- ~85% epic (outdoor wide vistas: arches, karst, hoodoos, salt-flats, lava-flows, geyser-fields, painted-desert, basalt-cliffs, sandstone-waves, travertine-terraces, yardang-ridges, balanced-rocks, mesas)

━━━ BIOME DISTRIBUTION (secondary tag) ━━━

Spread across: desert (~35%), volcanic (~25%), alpine (~15%), tropical-jungle/karst (~10%), arctic-polar (~10%), coastal (~5%).

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. ALL OUTDOOR. Multi-tier depth always. Specific geological feature + scale tag + biome tag. NO interior chambers. NO named places. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
