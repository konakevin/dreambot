#!/usr/bin/env node
/**
 * EarthBot reef-paradise — COMPOSITION axis (R2 PIVOT).
 *
 * Camera POV / framing:
 * - half-and-half waterline (~50%)
 * - pure above-water bay view (~35%)
 * - underwater-looking-up at shore silhouettes (~15%)
 *
 * MVP at 35.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_composition.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA COMPOSITION entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic). Each entry describes ONE camera POV / framing approach — the SPECIFIC angle / waterline-position the shot is captured from. NOT the bay. NOT the shoreline. NOT the sky. ONLY the camera.

━━━ THE BAR — THREE-WAY COMPOSITION DIVERSITY ━━━

Three distinct camera modes drive visual variety:
1. **Half-and-half waterline split** (~50%) — camera at waterline level, half submerged. Water below + sky/shoreline above in the same frame.
2. **Pure above-water bay view** (~35%) — camera fully above water. Looking ACROSS the bay toward the shoreline + sky.
3. **Underwater looking up** (~15%) — camera fully submerged in clear shallow water, looking UP toward the bright surface, shoreline + sky visible distorted above through the surface.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one composition direction, 14-28 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **A CAMERA MODE** (one of the three):
   - "half-and-half waterline split, camera right at the waterline, half-submerged"
   - "above-water bay view, camera floating just above the surface looking across the bay"
   - "underwater camera looking up toward the bright surface, shoreline visible distorted above"

2. **A FRAMING DETAIL** (what fills which part of the frame):
   - "water filling the lower 50% of the frame, shoreline + sky in upper 50%"
   - "bay water in the lower third, dramatic shoreline + dramatic sky in upper two-thirds"
   - "broad horizontal frame across the bay with shoreline rising in distance"
   - "looking up from just-below-surface, ripple-distorted shoreline + sky above"
   - "centered horizon line at the lower-third with dramatic sky filling upper two-thirds"

3. **A FRAMING ANCHOR** (one specific compositional element):
   - "horizon line cutting horizontally midway through the frame"
   - "shoreline silhouette dominating the upper third"
   - "sun positioned mid-upper between clouds"
   - "wide-open view across the bay toward distant headlands"
   - "low angle right at the waterline catching surface ripples"
   - "underwater foreground sand-bottom with surface caustics above"

━━━ HARD BANS ━━━

NEVER include:
- Specific bay / shoreline / water / sky content
- Above-water-only POVs (drone / aerial / from-cliff overlook — we want WATERLINE / IN-WATER POVs)
- Macro / close-up of one object
- Humans / divers / hands / fins / boats
- Coral / fish (this is a bay-view path, not reef)
- Named places
- Night

━━━ EXAMPLES ━━━

✓ "Half-and-half waterline split, camera right at the waterline half-submerged, water filling the lower 50% with shoreline and sky in the upper 50%"

✓ "Above-water bay view, camera floating just above the surface, broad horizontal frame across the bay with shoreline rising in the distance"

✓ "Underwater camera looking up toward the bright surface, ripple-distorted shoreline and sky visible above, sandy bottom in soft focus below"

✓ "Half-and-half waterline split with horizon centered at the lower-third, dramatic shoreline + sky filling the upper two-thirds of the frame"

✓ "Above-water bay view, camera at water-level looking ACROSS the bay toward distant headlands, sky filling the upper half"

✓ "Underwater looking up at the bright surface from a sand-bottom shallow, palm and ridge silhouettes visible distorted through the surface above"

✓ "Half-and-half waterline split, camera at waterline catching surface ripples in foreground, shoreline + dramatic sun-burst sky rising above"

✓ "Above-water bay panorama, camera just above the water, wide horizontal frame across the bay with horizon line at mid-frame"

✓ "Half-and-half waterline split, low angle right at the surface, water surface ripples flickering across the lower frame with shoreline rising in the upper"

✓ "Underwater foreground sand-bottom with caustic light patterns, surface above shimmering with distorted shoreline silhouettes visible through"

✗ BAD — drone aerial: "Drone shot from 200 feet above the bay" (BANNED — we are at waterline)
✗ BAD — specific content: "Looking across the bay at a Bora Bora caldera" (BANNED — generic only, no specific content)
✗ BAD — macro: "Macro close-up of a sand grain" (BANNED — scene composition only)
✗ BAD — diver: "Diver-POV with snorkel mask in foreground" (BANNED — no humans)

━━━ MODE DISTRIBUTION ━━━

- ~50% half-and-half waterline split
- ~35% above-water bay view
- ~15% underwater looking up

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Camera composition only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
