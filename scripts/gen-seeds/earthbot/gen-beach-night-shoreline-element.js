#!/usr/bin/env node
/**
 * EarthBot beach-night — SHORELINE ELEMENT axis.
 *
 * Natural foreground element on the night beach — palm silhouettes,
 * lava rocks, driftwood, sand patterns. NO human-built (tiki / lantern
 * / dock / fire pit / structure).
 *
 * R0 = 35.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_shoreline_element.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} NIGHT SHORELINE ELEMENT entries for EarthBot beach-night. Each entry describes ONE natural foreground element on the tropical-beach shoreline at night. NEVER human-built (no tiki torches / lanterns / fire pits / docks / piers).

━━━ THE BAR — ONE NATURAL FOREGROUND ELEMENT ━━━

Palm silhouettes, weathered driftwood, smooth lava rocks, wave-worn boulders, sand patterns. Real natural shore details at night.

━━━ ABSOLUTELY BANNED ━━━

- Tiki torches / lanterns / paper lanterns / hurricane lanterns
- Bonfires / fire pits / campfires / driftwood-fires
- Dock posts / piers / boardwalks / lighthouses
- Overwater bungalows / huts / cabanas / tiki bars
- Beach umbrellas / lounge chairs
- Humans / sunbathers / surfers
- Bioluminescent / glowing
- Sci-fi / fantasy

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-22 words each.

━━━ ELEMENT TYPES ━━━

PALM SILHOUETTES:
- Tall coconut palm silhouettes lining the inland fringe of the beach against the night sky
- A solo coconut palm silhouette arching gracefully at the lateral frame-edge
- A cluster of palm-tree silhouettes silhouetted against the night sky at the beach's inland fringe

LAVA ROCKS / VOLCANIC SHORE:
- Smooth wave-worn lava rocks at the surf line in the foreground
- A few weathered black-lava boulders silhouetted along the foreground sand
- Volcanic-rock outcroppings extending from the beach into the water at the foreground edge

DRIFTWOOD:
- A solitary weathered driftwood snag in the foreground sand
- A scattered cluster of bleached driftwood pieces lying across the foreground beach
- A large twisted driftwood log silhouetted on the foreground sand

SAND PATTERNS:
- Wind-swept sand ripples crossing the foreground beach
- Wave-textured sand patterns at the foreground tide line
- Smooth tropical white sand stretching across the foreground

TIDE POOLS:
- A cluster of small tide pools in the foreground beach
- Tide pools dotting the foreground rock shelf

TROPICAL FLORA (natural shoreline plants):
- Sea-grape bushes at the inland edge silhouetted against the night sky
- Beach-naupaka shrubs along the foreground edge

━━━ EXAMPLES ━━━

✓ "Tall coconut palm silhouettes lining the inland fringe of the beach against the night sky"

✓ "A solo coconut palm silhouette arching gracefully at the lateral frame-edge"

✓ "Smooth wave-worn lava rocks at the surf line in the foreground"

✓ "A solitary weathered driftwood snag in the foreground sand"

✓ "Wind-swept sand ripples crossing the foreground beach"

✓ "A few weathered black-lava boulders silhouetted along the foreground sand"

✓ "A cluster of small tide pools in the foreground beach reflecting faint sky light"

✓ "A scattered cluster of bleached driftwood pieces lying across the foreground beach"

✓ "Sea-grape bushes at the inland edge silhouetted against the night sky"

✓ "Volcanic-rock outcroppings extending from the beach into the water at the foreground edge"

✗ BAD — tiki: "A tiki torch in the foreground" (BANNED)
✗ BAD — bonfire: "Bonfire on the sand" (BANNED)
✗ BAD — dock: "Wooden dock extending into the water" (BANNED)
✗ BAD — human: "A sunbather on the sand" (BANNED)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE natural foreground element. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
