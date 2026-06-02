#!/usr/bin/env node
/**
 * EarthBot hawaii-flowers — SUBJECT axis (R3 beach-only architecture,
 * 2026-05-21).
 *
 * Architecture pivot: flowers are now a SEPARATE axis (HAWAII_FLOWERS_ARRANGEMENTS
 * reuses the 200-entry legacy tropical_flower_arrangements pool). Subject
 * pool is now BEACH-ONLY — focuses on ground-level tropical beach settings
 * with palms where a foreground flower cluster can naturally sit between
 * camera and the beach.
 *
 * R0 + R1 + R2 problems were trying to bake flowers INTO the subject
 * description. New architecture lets each axis own its conceptual lane
 * (LESSON 4 — axis-clean discipline).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/hawaii_flowers_subject.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUBJECT entries for EarthBot hawaii-flowers — each entry describes ONE GROUND-LEVEL TROPICAL BEACH SETTING. This is the BEACH only — flowers come from a separate axis at render time. Do not name flowers here.

━━━ THE BAR — GROUND-LEVEL TROPICAL BEACH (NO FLOWERS) ━━━

Each entry is a wide flat tropical beach scene viewed from ground-level — composed so a foreground flower cluster could naturally sit between camera and the beach. The scene has SAND foreground, PALMS visible, calm tropical surf, and a tropical sky/distant context. NO cliffs as primary. NO waterfalls. NO jungle interiors. NO flowers (the flowers axis adds them).

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["coastal-tropical"], "description": "<ground-level tropical beach setting, 22-35 words, no flowers>" }

Every entry has "coastal-tropical". Optional secondary "volcanic" for Hawaiian black-sand-beach + volcanic-rock context.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **GROUND-LEVEL POV** (so foreground flowers can compose in front):
   - "Ground-level POV across..."
   - "Eye-level at the inland palm-line of..."
   - "Camera-low across the sand toward..."
   - "From a beach-edge vantage across..."

2. **WIDE FLAT TROPICAL BEACH FILLING THE FULL MIDGROUND OF FRAME** — sand must be visible across the entire width of the frame:
   - "wide flat white-sand crescent extending across the full midground of the frame"
   - "Hawaiian black volcanic-sand crescent stretching across the full width of the frame"
   - "palm-fringed coral-sand atoll beach extending wide across the midground"
   - "Polynesian motu palm-fringed lagoon-shore sand extending wide"
   - "Caribbean palm-fringed crescent stretching across the full midground"
   - "Bali tropical-coast palm-fringed black sand extending across the frame"

3. **PALMS visible** at the inland fringe:
   - "tall coconut palms silhouetted at the inland fringe of the beach"
   - "twin coconut palms framing the lateral edges of the beach"
   - "Maui multi-palm grove silhouetted along the inland edge of the beach"
   - "scattered coconut palms standing along the inland palm-line"

4. **CALM TROPICAL WATER at the surf line** (the sea is OPEN HORIZON, not enclosed):
   - "gentle shorebreak surf curling at the foreground sand"
   - "mirror-glass turquoise lagoon stretching to the open ocean horizon"
   - "calm cobalt Pacific water stretching to the open horizon"
   - "gentle surf at the foreground sand, open ocean stretching to the horizon"

5. **OPEN HORIZON LINE** (NO distant mountains/islands/headlands as backdrop):
   - The water meets an OPEN HORIZON — no dramatic distant land
   - NO "distant volcanic-island silhouette" / NO "distant mountain" / NO "distant headland" / NO "ridge backdrop"
   - The horizon is just water meeting sky. Clean, open, tropical.

━━━ HARD BANS ━━━

NEVER include:
- ANY flower names or "blooms" / "blossom" / "flowering" / "in bloom" — flowers come from the FLOWERS axis
- "cliff" / "sea-cliff" — banned
- "waterfall" / "cascade" — banned
- "jungle interior" / "deep jungle" — banned
- "mountain" / "mountain peak" / "volcanic peak" / "ridge" / "headland" / "distant island silhouette" — BANNED ENTIRELY (caused R4 backdrop-drift; Flux renders mountain backdrops). The horizon is OPEN WATER ONLY.
- "canyon" / "cove" — banned
- "macro" / "close-up" — banned
- "rocky shore" / "boulder foreground" — banned (foreground is sand)
- Tourist landmark names
- Human-built features per LESSON 8
- Humans
- "sun-disc" alone
- sci-fi / magical
- Active volcanic eruption

━━━ EXAMPLES (study format — open-horizon ground-level beach scene, NO mountain/island backdrop, NO flowers) ━━━

✓ { "tags": ["coastal-tropical"], "description": "Ground-level POV across a wide flat Hawaiian white-sand crescent extending across the full midground of the frame, tall coconut palms silhouetted at the inland fringe, gentle shorebreak surf curling at the foreground sand, open Pacific stretching to the horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Eye-level at the inland palm-line of a wide flat Hawaiian white-sand beach extending wide across the frame, twin coconut palms framing the lateral edges, mirror-glass turquoise lagoon stretching to the open ocean horizon" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Camera-low across a Hawaiian black volcanic-sand crescent stretching across the full width of the frame, Maui multi-palm grove silhouetted along the inland edge, calm cobalt Pacific water stretching to the open horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Ground-level POV across a palm-fringed Polynesian motu lagoon-shore sand extending wide across the midground, scattered coconut palms standing along the inland palm-line, mirror-glass turquoise lagoon stretching to the open horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Ground-level POV across a Caribbean palm-fringed white-sand crescent stretching across the full midground, tall coconut palms silhouetted in a row at the inland fringe, gentle shorebreak surf curling at the foreground sand, open ocean to the horizon" }

✓ { "tags": ["coastal-tropical"], "description": "From a beach-edge vantage across a Tahitian palm-fringed coral-sand beach extending wide across the midground, scattered coconut palms standing along the inland edge, mirror-glass turquoise lagoon stretching to the open horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Eye-level at the inland edge of a palm-fringed Maldivian coral-sand atoll beach extending wide across the midground, scattered coconut palms silhouetted along the inland fringe, mirror-glass turquoise lagoon stretching to the open horizon" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Ground-level POV across a Bali tropical-coast palm-fringed black-sand crescent stretching across the full midground, tall coconut palms silhouetted at the inland fringe, gentle surf curling at the foreground sand, open ocean stretching to the horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Camera-low across a Costa Rican palm-fringed white-sand crescent extending across the full midground, scattered coconut palm cluster standing along the inland palm-line, calm Pacific surf at the foreground sand, open ocean stretching to the horizon" }

✓ { "tags": ["coastal-tropical"], "description": "Eye-level at the inland palm-line of a Hawaiian palm-fringed white-sand crescent extending wide, scattered tall palms silhouetted overhead at the inland edge, mirror-glass turquoise lagoon stretching to the open ocean horizon" }

✗ BAD — names flowers: "Beach with hibiscus at the inland fringe" (BANNED — flowers come from flowers axis)
✗ BAD — cliff: "Hawaiian cliff coast" (BANNED — no cliffs)
✗ BAD — aerial: "Aerial drone over atoll" (BANNED — ground-level POV only)
✗ BAD — mountain backdrop: "Distant volcanic-island silhouette in the deep distance" (BANNED — caused R4 backdrop-drift; horizon is OPEN water only)
✗ BAD — headland: "Distant palm-fringed headland silhouette across the bay" (BANNED — same reason)

━━━ COAST-TYPE DISTRIBUTION ━━━

- ~35% Hawaiian palm-fringed white-sand crescent
- ~25% Hawaiian black volcanic-sand crescent
- ~15% Polynesian / Tahitian motu (palm-fringed lagoon shore)
- ~15% Caribbean / Maldivian palm-fringed coral-sand
- ~10% Bali / Indonesian volcanic-coast palm-beach

━━━ POV DISTRIBUTION ━━━

All entries are ground-level (no aerials, no cliff-edge looking down). Spread across:
- ~30% Ground-level POV across the beach
- ~25% Eye-level at the inland palm-line
- ~20% Camera-low across the sand
- ~15% Looking out from a low headland
- ~10% From a beach-edge vantage

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Ground-level tropical beach setting + palms + sand + calm tropical water + distant context. NO flowers. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
