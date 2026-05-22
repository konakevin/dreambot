#!/usr/bin/env node
/**
 * EarthBot hidden-corner — SUBJECT axis.
 *
 * The off-the-beaten-path secret pocket of nature you stumble into.
 * Hidden creek bends, fern grottos, secret waterfall pools, tide pools,
 * mossy clearings, sun-shaft glades, wildflower-packed coves.
 *
 * INTIMATE mid-tight framing. LUSH packed detail. Real-Earth ONLY.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_subject.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot hidden-corner. Each entry names ONE off-the-beaten-path secret pocket of nature — the kind of magical hidden place you'd stumble into miles from any trail and gasp "I can't believe I found this." Real Earth ONLY. INTIMATE mid-tight framing, NEVER wide panorama.

━━━ THE BAR — LUSH OFF-THE-BEATEN-PATH SECRET POCKET ━━━

The secluded, untouched, magical pocket of nature. Hidden creek bend, fern grotto in old-growth forest, mossy waterfall pool no one visits, hidden tide pool, sun-shaft glade in deep forest, wildflower-packed cove, secret meadow tucked behind a ridge, mossy log clearing, ancient root cluster forming a hollow.

LUSH MANDATE: every entry must imply RICH multi-element content — moss + ferns + water + stones + multiple flora. Never a sparse / empty / minimal setting.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<hidden-corner setting, 20-40 words>" }

Bare strings also acceptable.

━━━ HIDDEN CORNER TYPES (mix freely across these — every entry distinct) ━━━

- HIDDEN CREEK BENDS — secluded stream curves with mossy boulders, fern-lined banks, water-smoothed pebbles
- FERN GROTTOS — deep-shade pockets in old-growth forest, walls draped in maidenhair fern, dripping moss
- WATERFALL POOLS — small unmapped cascade pools, mossy rim stones, fern-fringed edges
- TIDE POOLS — quiet rocky-coast pools no one visits, anemone-studded, kelp-fringed, sea-stars
- FOREST CLEARINGS — sun-pierced glades wrapped in flora, wildflower understory, fallen mossy logs
- WILDFLOWER COVES — secret meadow pockets brimming with mixed wildflowers, fern edges
- MOSSY LOG NOOKS — fallen ancient log clearings, moss-cushioned, mushroom-studded
- ANCIENT ROOT POCKETS — exposed root clusters forming sheltered hollows, moss + fern
- DAMP CANYON ALCOVES — narrow canyon corner pockets, mossy walls, dripping ferns
- HIDDEN POND EDGES — quiet still-water edges with lily pads, cattail clusters, frog habitats
- SUN-SHAFT GLADES — golden-hour beam piercing dense canopy onto a packed moss-floor scene
- SPRING SOURCES — wet rock seeps where water emerges, moss-cushioned, fern-fringed

━━━ EXAMPLES ━━━

✓ { "description": "A secluded creek bend tucked behind a mossy ridge — water-smoothed stones carpeted in emerald moss, lacy maidenhair ferns draping the banks, fallen leaves swirling on the slow water surface, shaft of dappled forest light piercing the canopy above" }

✓ { "description": "A hidden fern grotto deep in old-growth temperate rainforest — towering ancient trunks wrapped in moss, sword ferns and bracken filling every gap, dripping water seeping from the rock walls, soft filtered light from far above" }

✓ { "description": "A secret tide-pool pocket on a rocky cove no one visits — anemone-studded edges, ochre sea stars clinging to wet stone, kelp-fringed walls, sand-bottom rippling with light, tiny crab tracks across the surface" }

✓ { "description": "A small unmapped waterfall pool in mossy rainforest — single tier of water cascading over fern-fringed lip, mossy boulders ringing the basin, water-droplet spray glittering in the filtered light, lily pads floating on the still center" }

✓ { "description": "A sun-shaft glade hidden in deep forest — golden beam piercing through dense canopy onto a packed clearing of wildflowers, mossy fallen log at the center, fern carpet beneath, mushroom clusters at the base of the trunks" }

━━━ ABSOLUTELY BANNED ━━━

- Wide panorama / epic vista / mountain ridges as dominant frame
- Bioluminescent / phosphorescent / foxfire / glowing-fungi (NEVER — legacy fantasy trigger)
- Aurora / nacreous / iridescent clouds / sun-dogs / fire-rainbow (supernatural drift)
- Sci-fi / fantasy / portal / mystical
- Architecture / cabin / bridge / fence / stone-steps / path / signage
- Humans / footprints / clothing
- Named places (e.g. "Olympic National Park")
- Empty / sparse / minimal compositions
- "Fire" as a noun
- Stylized / cartoony / 3D-render

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE hidden-corner setting per entry. LUSH packed detail, real-Earth only, intimate framing. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
