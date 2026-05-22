#!/usr/bin/env node
/**
 * EarthBot geological-wonder — FOCAL ANCHOR axis (R3 outdoor-only).
 *
 * R2 still had ~50% intimate cave-anchors (stalactite-from-ceiling, ice-
 * crystal-in-chamber, mineral-pool-reflecting-ceiling) — those only fit
 * cave-interior subjects which the R3 subject pool no longer has.
 *
 * R3: outdoor-only focal anchors. ~15% intimate-outdoor (close-up of an
 * outdoor feature) / ~85% epic-outdoor (lone trees, single waterfall
 * threads, solo geyser plumes, distant towers in foreground).
 *
 * No "proving the scale" phrasing (R2 R2 rewrite still holds).
 *
 * R0 = 40 entries.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/geological_wonder_focal_anchor.json';
// R3 production scale — append to existing 40 entries to reach 200.
generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FOCAL ANCHOR entries for EarthBot geological-wonder. Each entry describes ONE specific compositional anchor element in the FOREGROUND of an OUTDOOR geological scene. Playbook 8-component memorable-scene mandate.

━━━ THE BAR — ONE OUTDOOR FOCAL ELEMENT IN THE FOREGROUND ━━━

A focal anchor turns "abstract rock" into "a story." A single juniper clinging to a hoodoo, lone snag silhouetted on a ridge, single waterfall thread plunging from a high source, solo geyser plume, single eroded boulder in foreground.

ALL anchors are OUTDOOR elements — never cave-interior features. The viewer is positioned outside, looking at the geological formation, with the focal anchor in the foreground providing depth.

━━━ CRITICAL LANGUAGE RULE — NO "PROVING THE SCALE" PHRASING ━━━

DO NOT write "proving the scale" / "proving the height" / "proving the depth" / "proving the immense scale" / "proving the vast height".

WHY: That exact phrasing pairs with HUMAN FIGURES in landscape-photography training data. Even with "no humans" elsewhere, this triggers Flux's scale-prover bias.

✗ FORBIDDEN phrasings:
- "proving the [vast / immense / staggering / crushing] scale"
- "proving the height of X above"
- "proving X's full height"

✓ REPLACEMENT phrasings:
- "in the foreground" / "filling the foreground depth"
- "set against the X extending behind / above / below"
- "at the threshold of"
- "anchoring the lower frame"
- "the formation visible behind / extending beyond"
- "framing the lower edge"

━━━ CRITICAL POV RULE — OUTDOOR ANCHORS ONLY ━━━

Anchors live in outdoor scenes. NO cave-interior anchors (no stalactites-from-ceiling, no ice-crystal-clusters-in-chamber, no mineral-pool-reflecting-ceiling, no chamber-portal anchors).

✗ FORBIDDEN cave-interior anchors:
- "A single stalactite hanging from the cave ceiling"
- "Ice crystals hanging from the chamber roof"
- "A mineral pool reflecting the cave ceiling"
- "A chamber-opening / portal visible in the back wall"
- "A stalagmite rising from the chamber floor"

✓ REQUIRED outdoor anchors:
- "A single juniper clinging to a hoodoo spire"
- "One lone snag silhouetted on the cliff edge"
- "A single waterfall thread plunging down the cliff face"
- "One solo geyser plume erupting against the wide field"
- "A single sandstone arch standing in the foreground"
- "One eroded sandstone tower silhouetted in the foreground"
- "A small stream of water winding across the salt flat foreground"
- "A solitary boulder in the foreground"
- "One thermal vent steaming in the geyser field foreground"
- "A pile of fresh pumice in the foreground"
- "One single tree clinging to a rock outcrop"
- "A natural rock arch in the foreground framing the distance"
- "One frozen ice column on a rock face"

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["epic"], "description": "<outdoor anchor element, 14-24 words>" }
OR (smaller % — for intimate-outdoor close-up scenes)
{ "tags": ["intimate"], "description": "<outdoor close-up anchor, 14-24 words>" }

The "tags" array MUST include "intimate" OR "epic" as FIRST tag. Optional second tag for biome.

━━━ INTIMATE ANCHORS (~15%) — for outdoor close-up scenes ━━━

For scenes where the geological feature fills 50-70% of frame with some vista visible beyond. Anchor sits in the foreground of the close-up.

- A single weathered driftwood snag in the desert foreground
- One small clutch of dried wildflowers at the base of the rock face
- A solitary cluster of small mineral seep streaks in the foreground
- One small boulder in the immediate foreground with the formation rising behind
- A patch of frost-covered lichen on a foreground rock surface

━━━ EPIC ANCHORS (~85%) — outdoor wide-vista scenes ━━━

- A single twisted juniper clinging to the side of a hoodoo spire, set against the spire's striated layers extending above
- One lone pine clinging to a basalt-cliff ledge in the middle distance
- A single thin waterfall thread plunging down a cliff face from a high source
- One solo geyser plume erupting against the wide field beyond
- A single sandstone arch standing in the foreground, framing the wider vista beyond
- One eroded sandstone tower silhouetted in the foreground, set against the distant horizon
- A small stream of water winding across the salt flat in the foreground
- One lone snag (dead tree) silhouetted at the foreground edge
- A solitary boulder standing in the foreground
- One mineral pool steaming in the foreground of the wider plain
- A single thermal vent steaming in the geyser field foreground
- A pile of fresh pumice in the foreground, set against the lava-flow field beyond
- A single eroded mesa rising in the middle distance
- A small alpine tree at the cliff's edge in the foreground
- One twisted bristlecone pine in the foreground silhouetted against the distant range
- A single natural arch in the foreground framing the wider canyon beyond
- One isolated balanced rock in the foreground
- A small cluster of agave plants in the desert foreground
- One lone yucca silhouetted against the distant mesa

━━━ HARD BANS ━━━

NEVER include:
- "Proving the [scale / height / depth / vastness]" phrasing
- Cave-interior anchors (stalactites from ceiling, chamber pools, etc.)
- Subject content (no "hoodoo amphitheater with tree" — subject axis owns the formation)
- Lighting words (no "tree lit by godrays" — lighting axis)
- Atmosphere (no "tree in the mist" — atmosphere axis)
- Mineral colors (no "amethyst-violet wall behind tree" — mineral_color axis)
- Humans / hikers / climbers / silhouettes
- Buildings / railings / walkways / structures
- Animals (no birds / no wildlife — only natural inanimate anchors)
- Multiple anchors (ONE per entry — the "single" is non-negotiable)
- Sci-fi / fantasy / magical objects

━━━ EXAMPLES ━━━

✓ { "tags": ["epic", "desert"], "description": "A single twisted juniper clinging to the side of a hoodoo spire, set against the spire's red-orange striated layers extending above" }

✓ { "tags": ["epic", "alpine"], "description": "One lone pine clinging to a basalt-cliff ledge in the middle distance, set against the cliff face rising behind" }

✓ { "tags": ["epic"], "description": "A single thin waterfall thread plunging down the cliff face from a high alpine source, ribbon of water against dark rock" }

✓ { "tags": ["epic", "volcanic"], "description": "One solo geyser plume erupting against the wide field beyond, the steam column rising above the mineral plain" }

✓ { "tags": ["epic", "desert"], "description": "A natural sandstone arch standing in the foreground, framing the wider distant hoodoo field beyond" }

✓ { "tags": ["epic"], "description": "A solitary lone snag dead tree silhouetted at the foreground edge, gnarled branches reaching against the dramatic vista beyond" }

✓ { "tags": ["epic"], "description": "A small stream of water winding across the salt flat in the foreground, catching low light in its mirror surface" }

✓ { "tags": ["epic", "volcanic"], "description": "A single thermal vent steaming in the geyser field foreground, the rising vapor column visible against the wider plain" }

✓ { "tags": ["epic", "desert"], "description": "A solitary eroded mesa rising in the middle distance, set against the painted-desert horizon beyond" }

✓ { "tags": ["epic", "desert"], "description": "One twisted bristlecone pine in the foreground silhouetted against the distant range, gnarled branches catching the light" }

✓ { "tags": ["intimate", "desert"], "description": "A solitary weathered driftwood snag in the desert foreground, the rock face rising behind toward the distant horizon" }

✓ { "tags": ["intimate"], "description": "One small boulder in the immediate foreground, the geological formation rising behind extending into deep distance" }

✗ BAD — cave anchor: "A single stalactite hanging from the cave ceiling" (BANNED — outdoor anchors only)
✗ BAD — cave anchor: "Ice crystals hanging from the chamber roof" (BANNED — outdoor only)
✗ BAD — "proving the scale": "Tree clinging to a hoodoo proving its immense scale" (BANNED — use "set against the spire extending above")
✗ BAD — multiple: "Three juniper trees clinging to hoodoos" (BANNED — ONE specific element)
✗ BAD — subject: "Hoodoo with tree" (BANNED — say "single juniper clinging to a hoodoo")
✗ BAD — lighting: "Tree lit by golden hour" (BANNED — lighting axis)
✗ BAD — humans: "A hiker standing on the cliff" (BANNED — zero humans)
✗ BAD — animals: "A bird soaring above" (BANNED — inanimate anchors only)

━━━ DISTRIBUTION ━━━

- ~15% intimate (outdoor close-up anchors)
- ~85% epic (outdoor wide-vista anchors)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. ONE specific OUTDOOR natural focal anchor + neutral foreground position language. NO "proving the scale" phrasing. NO cave-interior anchors. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
