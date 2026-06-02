#!/usr/bin/env node
/**
 * EarthBot reef-paradise — BAY SETTING axis (R2 PIVOT).
 *
 * The bay GEOMETRY ONLY — generic morphological descriptions, NO named
 * places. Just the type of bay/water-body the scene is set in.
 *
 * MVP at 50; scale after Kevin approves R0 batch.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_bay_setting.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BAY SETTING entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic, NOT underwater reef). Each entry describes ONE bay/water-body GEOMETRY — generic morphological description only. NO named places (no "Bora Bora" / "Hanauma" / "Tahiti" / "Maui" — Flux pigeonholes on tourist photos when those names land).

━━━ THE BAR — A DRAMATIC TROPICAL ISLAND BAY (described generically) ━━━

A tropical bay or lagoon or cove or inlet, ringed by dramatic shoreline. Crystal-clear turquoise water. Sun lit. Picture-postcard caliber. Describe the bay's SHAPE / EXTENT / WATER-COLOR-CONFIG, never name a real-world place.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["coastal-tropical"], "description": "<bay setting, 18-32 words, NO place names>" }

Every entry has "coastal-tropical". Optional secondary "volcanic" for entries describing volcanic-rock-rimmed bays / calderas / lava-coast inlets.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **A BAY SHAPE / TYPE** (generic morphology — vary across entries):
   - "volcanic-caldera bay enclosed by towering basalt walls"
   - "horseshoe-shaped cove ringed by palm-fringed cliffs"
   - "wide crescent lagoon stretching to the horizon"
   - "narrow fjord-like tropical inlet between jagged volcanic ridges"
   - "broad open island bay with deep water extending past the frame"
   - "shallow turquoise lagoon enclosed by an outer reef-edge"
   - "circular caldera bay ringed by towering volcanic ridges"
   - "deep cobalt-water inlet between two palm-fringed headlands"
   - "shallow protected cove tucked between lava-rock arms"
   - "sweeping bay arcing between two distant island headlands"

2. **WATER COLOR / CLARITY descriptor** (the water itself):
   - "crystal turquoise water"
   - "mirror-glass crystal lagoon"
   - "deep cobalt-fading-to-turquoise water"
   - "gradient sapphire-to-aquamarine bay"
   - "brilliant turquoise crystal clarity"
   - "clear glassy lagoon with visible sandy bottom"

3. **EXTENT** (so we know how big the body of water is):
   - "stretching past the frame"
   - "extending to the open horizon"
   - "filling the lower half of the visible distance"
   - "extending wide between dramatic headlands"
   - "stretching into deep distance"

━━━ HARD BANS ━━━

NEVER include:
- **Named real-world places** (NO "Bora Bora" / "Hanauma Bay" / "Tahiti" / "Maui" / "Hawaii" / "Polynesia" / "Caribbean" / "Indonesia" / "Bali" / "Maldives" / "Seychelles" / "Belize" / "Bonaire" / "Cook Islands" — generic only)
- Coral / fish / underwater elements (this is the BAY GEOMETRY axis)
- Shoreline detail (no "palms" / "cliffs" / "mountains" — that's shoreline_drama axis)
- Sky / cloud / sun-ray detail (no "sun-rays" / "clouds" — that's sky_drama axis)
- Camera / composition words
- Humans / divers / sunbathers
- Boats / docks / structures
- Cliffs as primary subject (we can mention them as bay-rim, but not as primary subject)
- Storm / dark / muddy water
- "Deep ocean" (this is a near-shore/bay context)

━━━ EXAMPLES ━━━

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Volcanic-caldera bay enclosed by towering basalt walls, brilliant turquoise crystal water filling the lower half, extending into deep cobalt at the center" }

✓ { "tags": ["coastal-tropical"], "description": "Horseshoe-shaped tropical cove, gradient sapphire-to-aquamarine water filling the bay, extending past the frame to the open horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Wide crescent lagoon, mirror-glass crystal water, deep cobalt center fading to brilliant turquoise edges, stretching to the open horizon" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Narrow fjord-like tropical inlet between jagged volcanic walls, deep cobalt-water filling the lower frame, water extending to a sliver of open ocean" }

✓ { "tags": ["coastal-tropical"], "description": "Broad open island bay, brilliant turquoise crystal clarity in the foreground fading to deep sapphire in the distance, extending wide between headlands" }

✓ { "tags": ["coastal-tropical"], "description": "Shallow protected cove with brilliant turquoise water, mirror-glass surface, extending between two low palm-headlands toward the open distance" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Circular caldera bay ringed by towering volcanic walls, brilliant turquoise water filling the foreground, deep sapphire at the center" }

✓ { "tags": ["coastal-tropical"], "description": "Sweeping arc-shaped bay between two distant headlands, gradient cobalt-to-turquoise water stretching past the frame on both sides" }

✓ { "tags": ["coastal-tropical"], "description": "Deep cobalt-water inlet between two palm-headlands, brilliant turquoise edges where the water shallows, surface mirror-glass and crystal" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Shallow protected cove tucked between two lava-rock arms, brilliant turquoise crystal water, gentle ripples crossing the surface, extending toward a deep cobalt opening" }

✗ BAD — named place: "Hanauma Bay horseshoe-shaped cove" (BANNED — generic only)
✗ BAD — named place: "Bora Bora caldera bay" (BANNED — say "volcanic-caldera bay" instead)
✗ BAD — coral: "Lagoon with coral garden below" (BANNED — coral identity is dead)
✗ BAD — shoreline: "Cove ringed by towering palm trees" (BANNED — shoreline_drama axis owns trees)
✗ BAD — sky: "Bay under bright sun-rays" (BANNED — sky_drama axis)

━━━ BAY-TYPE DISTRIBUTION ━━━

Spread across entries:
- ~25% volcanic-caldera bay enclosed by basalt walls
- ~20% horseshoe-shaped cove
- ~15% wide crescent lagoon
- ~15% narrow fjord-like tropical inlet
- ~10% shallow protected cove tucked between arms
- ~10% broad open island bay between distant headlands
- ~5% circular caldera

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Bay geometry + water color + extent. Generic only. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
