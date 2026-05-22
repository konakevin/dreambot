#!/usr/bin/env node
/**
 * EarthBot cozy-beach — FOREGROUND ELEMENT axis (v2 pivot).
 *
 * Cozy foreground accent — driftwood / shells / palm shadows / petals /
 * sand patterns / sea-grass / lone tropical flower.
 *
 * R0 = 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_foreground_element.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ELEMENT entries for EarthBot cozy-beach. Each entry describes ONE cozy natural foreground accent at close-camera that adds warmth and intimacy to the intimate beach moment.

━━━ THE BAR — ONE COZY NATURAL FOREGROUND ACCENT ━━━

Driftwood pieces in warm sand, scattered tropical shells, palm-shadow patterns, fallen tropical petals, soft sand ripples, sea-grass blades, a lone tropical flower bloom, weathered coconuts in foreground sand. Natural cozy details only.

━━━ ABSOLUTELY BANNED ━━━

- Architecture / man-made objects / boats / chairs / umbrellas / etc
- Humans / footprints / sandcastles / shoes / clothing
- The setting itself (subject_setting axis)
- Water details (water_state axis)
- Sky / light details
- Sci-fi / fantasy

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ FOREGROUND ELEMENT TYPES ━━━

DRIFTWOOD:
- A weathered piece of driftwood lying in the foreground sand
- A small cluster of bleached driftwood pieces scattered across warm sand
- A solitary weathered driftwood log close to camera in soft afternoon light
- A coil of weathered driftwood at the foreground sand line

SCATTERED SHELLS:
- Scattered tropical shells in the damp sand at the foreground tide line
- A small cluster of pearl-pink and cream shells dotted across the foreground sand
- A few iridescent abalone shells lying in the foreground sand
- A scattering of conch shells nestled in warm sand close to camera
- Several small spiral shells gathered at the foreground tide line

PALM-SHADOW PATTERNS:
- Long palm-frond shadow patterns raking across the foreground warm sand
- Dappled palm-shadow patterns across the foreground sand from arching palms above
- Soft palm-shadow stripes raked across the warm sand foreground

FALLEN TROPICAL PETALS:
- Scattered fallen plumeria petals across the warm foreground sand
- A drift of fallen hibiscus blossoms on the foreground sand
- Scattered yellow plumeria petals nestled in the damp foreground sand
- A few scarlet hibiscus blooms fallen in the warm sand foreground

SAND PATTERNS:
- Wind-rippled sand patterns crossing the warm foreground
- Wave-textured sand ripples in the damp foreground tide line
- Smooth wave-worn sand patterns extending across the foreground

SEA-GRASS / TROPICAL FLORA:
- A cluster of sea-grass blades catching low warm light in the foreground
- A few beach-naupaka leaves in the foreground sand
- A cluster of sea-grape leaves at the foreground

WEATHERED COCONUTS / NATURAL CLUTTER:
- A scattering of weathered coconuts in the foreground warm sand
- A pair of fallen coconuts nestled in soft sand close to camera

━━━ EXAMPLES ━━━

✓ "A weathered piece of driftwood lying in the foreground sand"

✓ "Scattered tropical shells in the damp sand at the foreground tide line"

✓ "Long palm-frond shadow patterns raking across the foreground warm sand"

✓ "Scattered fallen plumeria petals across the warm foreground sand"

✓ "A solitary weathered driftwood log close to camera in soft afternoon light"

✓ "A few iridescent abalone shells lying in the foreground sand"

✓ "A cluster of sea-grass blades catching low warm light in the foreground"

✓ "Wind-rippled sand patterns crossing the warm foreground"

✓ "A scattering of weathered coconuts in the foreground warm sand"

✓ "Soft palm-shadow stripes raked across the warm sand foreground"

✗ BAD — architecture: "A lounge chair in the foreground" (BANNED — no human-made)
✗ BAD — boats: "A small boat at the foreground" (BANNED)
✗ BAD — footprints: "Footprints leading away in the sand" (BANNED — no human presence)

━━━ DISTRIBUTION ━━━

- ~30% driftwood (logs / scattered pieces)
- ~25% scattered shells (tropical varieties)
- ~15% palm-shadow patterns
- ~15% fallen tropical petals
- ~10% sand patterns / sea-grass / tropical flora
- ~5% weathered coconuts / natural clutter

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE cozy natural foreground element per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
