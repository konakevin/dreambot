#!/usr/bin/env node
/**
 * EarthBot beach-night — WATER STATE axis.
 *
 * Calm reflective tropical water at night. Mirror-glass / gentle
 * ripples / faint surf / wet-sand reflections. NO bioluminescent /
 * phosphorescent / glowing waves (sci-fi trigger).
 *
 * R0 = 35.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_water_state.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} NIGHT WATER STATE entries for EarthBot beach-night. Each entry describes ONE tropical water surface state at night — calm reflective tropical water. The water carries the light_source as reflection.

━━━ THE BAR — CALM REFLECTIVE TROPICAL NIGHT WATER ━━━

The water is calm at night. Light_source (moon / stars / Milky Way) reflects on the surface. Surface texture varies: mirror-glass, gentle ripples, faint surf at the foreground, wet-sand reflection.

━━━ ABSOLUTELY BANNED ━━━

- "Bioluminescent waves" / "phosphorescent" / "electric-blue surf" / "glowing surf"
- "Crashing waves" / "rough surf" / "stormy water" (calm tropical night only)
- Subject content / light source words / sky details
- Humans
- Sci-fi / fantasy
- Daylight / sunset

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-24 words each.

━━━ WATER STATE TYPES ━━━

MIRROR-CALM:
- Mirror-glass calm tropical lagoon at night, perfectly still surface reflecting the sky overhead
- Glass-still tropical water at low tide, the surface a perfect mirror

GENTLE RIPPLES:
- Gentle ripples crossing the calm tropical water surface, faint silver reflections shimmering
- Soft tropical surface with delicate ripples, faint silver light catching the wavelet edges

SILVER REFLECTIVE PATH:
- A silver-white moonlit path stretching across the calm tropical water surface
- A copper-silver light path across the calm water from the horizon to the foreground

WET-SAND REFLECTION:
- Wet sand at the foreground catching faint silver reflection, calm surf line beyond
- Low-tide wet-sand mirror at the foreground, calm tropical water beyond

FAINT SURF:
- Gentle surf curling softly at the foreground sand line, calm water beyond
- Faint surf ripples breaking softly along the foreground sand, distant water mirror-calm

REFLECTIVE TIDE POOLS:
- Tide pool clusters in the foreground reflecting sky overhead, calm water beyond

━━━ EXAMPLES ━━━

✓ "Mirror-glass calm tropical lagoon at night, perfectly still surface reflecting the sky overhead"

✓ "Gentle ripples crossing the calm tropical water surface, faint silver reflections shimmering"

✓ "A silver-white moonlit path stretching across the calm tropical water surface from horizon to foreground"

✓ "Wet sand at the foreground catching faint silver reflection, calm surf line beyond"

✓ "Glass-still tropical water at low tide, the surface a perfect mirror reflecting the sky"

✓ "Gentle surf curling softly at the foreground sand line, calm water beyond reflecting faint light"

✓ "A copper-silver light path across the calm water from the horizon to the foreground"

✓ "Soft tropical surface with delicate ripples, faint silver light catching the wavelet edges"

✓ "Tide pool clusters in the foreground reflecting sky overhead, calm water mirror beyond"

✓ "Low-tide wet-sand mirror at the foreground, calm tropical water extending toward horizon"

✗ BAD — bioluminescent: "Bioluminescent waves glowing electric blue" (BANNED — sci-fi)
✗ BAD — stormy: "Rough crashing surf" (BANNED — calm tropical only)
✗ BAD — light source: "Water reflecting the bright moon" (allowed lightly but light_source axis owns "moon" — focus on water)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Calm reflective tropical night water only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
