#!/usr/bin/env node
/**
 * EarthBot cozy-beach — SUBJECT SETTING axis (v2 pivot).
 *
 * The intimate tropical beach pocket where the cozy moment happens.
 * Mid-tight framing — never wide vista.
 *
 * R0 = 50.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_subject_setting.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUBJECT SETTING entries for EarthBot cozy-beach. Each entry describes ONE intimate tropical beach pocket setting where a cozy moment happens. Mid-tight framing — NEVER wide-vista panorama. Generic morphology only — NO named places.

━━━ THE BAR — INTIMATE COZY TROPICAL BEACH POCKET ━━━

A quiet, intimate corner of a tropical beach. A pocket cove framed by palms, a warm sand patch in palm-shadow, a small tide pool with calm water, a driftwood-strewn warm sand bench, a lush-fringed tropical sand corner. The viewer should feel "I want to lie down here forever." Cozy, intimate, warm.

━━━ ABSOLUTELY BANNED ━━━

- Architecture / cottages / villages / lighthouses / huts / cabanas
- Boats / docks / piers
- Beach umbrellas / lounge chairs / towels / coolers / bags
- Bonfire / fire pit / tiki torches
- Humans / footprints / sandcastles
- Wide-vista panorama / aerial drone shots / horizon-stretching views
- Specific foreground details (foreground_element axis owns those)
- Water details (water_state axis)
- Sky details (sky_layer axis)
- Light condition (light_condition axis)
- Bioluminescent / sci-fi
- Named places

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 18-30 words each.

━━━ SETTING TYPES (rotate aggressively — all intimate / mid-tight) ━━━

PALM-SHADOWED COVE:
- A small palm-shadowed tropical pocket cove, the inland palm-line casting cool shadow across warm sand
- An intimate palm-fringed pocket of warm sand framed by tall palms on both sides
- A tropical sand-patch tucked beneath an arching palm canopy

CLOSE COVE WITH SOFT WATER:
- A small tropical inlet with calm soft water reaching warm sand at the foreground
- A protected pocket bay with gentle shorebreak at the foreground sand line
- A tiny palm-fringed cove with calm reflective water and a thin sand crescent

DRIFTWOOD-STREWN WARM SAND:
- A warm sand patch with scattered driftwood logs in soft afternoon shadow
- A tropical beach corner with weathered driftwood pieces lying in warm sand
- An intimate warm sand bench between rocky outcrops, weathered driftwood scattered

TIDE POOL / WET-SAND MIRROR:
- A small tide pool at the foreground of warm sand, the pool reflecting the warm sky
- A wet-sand mirror at low tide along an intimate tropical sand corner
- A shallow tide pool tucked in a sand-rock pocket, soft water reflecting

PALM-SHADOW PATTERNS ON SAND:
- A warm sand patch dappled with palm-frond shadow patterns from arching palms overhead
- An intimate sand expanse with raking palm-shadow patterns from the inland palm-line
- A close-camera sand foreground with palm-shadow dapple across warm sand

LUSH-FRINGED CORNER:
- A tropical sand corner fringed with sea-grape bushes and beach-naupaka
- An intimate pocket of sand bordered by dense tropical foliage and a few palms
- A warm sand patch tucked behind a dense beach-vegetation fringe

━━━ EXAMPLES ━━━

✓ "A small palm-shadowed tropical pocket cove, the inland palm-line casting cool shadow across warm sand"

✓ "An intimate palm-fringed pocket of warm sand framed by tall palms on both sides"

✓ "A warm sand patch with scattered driftwood logs in soft afternoon shadow"

✓ "A small tide pool at the foreground of warm sand, the pool reflecting the warm sky"

✓ "A warm sand patch dappled with palm-frond shadow patterns from arching palms overhead"

✓ "A tropical sand corner fringed with sea-grape bushes and beach-naupaka"

✓ "A protected pocket bay with gentle shorebreak at the foreground sand line"

✓ "A tropical beach corner with weathered driftwood pieces lying in warm sand"

✓ "An intimate warm sand bench between rocky outcrops, weathered driftwood scattered"

✓ "A wet-sand mirror at low tide along an intimate tropical sand corner"

✗ BAD — architecture: "A cottage on the beach edge" (BANNED — pivoted away from architecture)
✗ BAD — wide vista: "A vast tropical beach extending to horizon" (BANNED — mid/tight only)
✗ BAD — humans: "A sand spot with footprints leading to the water" (BANNED — no humans/footprints)
✗ BAD — boats: "A small fishing boat pulled onto the sand" (BANNED — no human-built)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Intimate beach setting only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
