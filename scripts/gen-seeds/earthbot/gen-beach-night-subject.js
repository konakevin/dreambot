#!/usr/bin/env node
/**
 * EarthBot beach-night — SUBJECT axis.
 *
 * Tropical beach geographic setting at NIGHT. Generic morphological
 * descriptions only — NO named places.
 *
 * R0 = 50.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_subject.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TROPICAL BEACH NIGHT SUBJECT entries for EarthBot beach-night. Each entry describes ONE tropical-beach GEOGRAPHIC SETTING at NIGHT. The setting holds the stage — the light_source axis brings the actual moonlight / starlight / Milky Way. Generic morphological descriptions only — NO named places (LESSON 7).

━━━ THE BAR — REAL TROPICAL BEACH GEOGRAPHY AT NIGHT ━━━

Each entry names ONE tropical-beach setting type at night. The setting must be CLEARLY TROPICAL (palms, white-sand crescent, lagoon, coral atoll, volcanic-rock coast, coral cay) AND CLEARLY NIGHT (no sunset, no sunrise, fully dark sky context). NO architecture, NO man-made objects.

━━━ ABSOLUTELY BANNED ━━━

NEVER include:
- Named places (no "Bora Bora" / "Hawaii" / "Maldives" — generic only)
- Light source words (no "moonlight" / "Milky Way" — that's the light_source axis)
- Sky details (no "stars overhead" / "clouds drifting" — that's the night_sky axis)
- Water details (no "reflecting moon" — that's the water_state axis)
- Shoreline element details (no "palm silhouettes" as primary — that's the shoreline_element axis)
- Humans
- Architecture / tiki / lanterns / dock posts / piers / bonfires / fire pits / lighthouses / huts / bungalows
- Bioluminescent / phosphorescent
- Sunset / sunrise / daylight
- Sci-fi / fantasy

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one tropical-beach-at-night setting, 18-30 words.

━━━ SETTING TYPES (rotate aggressively) ━━━

- A wide tropical white-sand crescent beach at night, the open lagoon extending toward the horizon
- A tropical palm-fringed cove at night, the bay surrounded by dark volcanic ridges
- A horseshoe-shaped tropical lagoon at night, sand-floored shallow water filling the foreground
- A volcanic black-sand beach at night, the surf line catching faint light at the foreground
- A Polynesian motu atoll lagoon at night, the lagoon extending in still calm water
- A Caribbean cay beach at night, a thin curving sand bar visible
- A coral atoll lagoon at night, the still water extending toward a thin distant reef line
- A tropical pocket cove at night between two low coastal rocks
- A wide reef-flat at night during low tide, exposed coral and sand patterns visible
- A tropical jungle-fringed beach at night, dense dark foliage rising at the inland fringe
- A wide tropical sweep of white sand at low tide at night, wet sand mirror catching faint light
- A volcanic shoreline at night with sand pockets between black-lava arms
- A tropical inlet at night between two converging headlands, calm water filling the foreground

━━━ EXAMPLES ━━━

✓ "A wide tropical white-sand crescent beach at night, the open lagoon extending toward the deep horizon"

✓ "A palm-fringed tropical cove at night, the bay surrounded by dark volcanic ridges silhouetted in the upper frame"

✓ "A volcanic black-sand beach at night, the surf line catching faint light at the foreground, the open ocean extending into deep night-dark"

✓ "A Polynesian motu atoll lagoon at night, the lagoon stretching wide in still calm water, distant motu silhouettes visible at horizon"

✓ "A horseshoe-shaped tropical lagoon at night, sand-floored shallow water filling the foreground, dark coastal walls framing both sides"

✓ "A wide tropical reef-flat at night during low tide, exposed coral and sand patterns visible across the foreground"

✓ "A tropical jungle-fringed beach at night, dense dark foliage rising at the inland fringe, sand crescent visible in foreground"

✓ "A wide white-sand tropical beach at night with wet-sand mirror surface at low tide catching faint reflections"

✓ "A tropical pocket cove at night between two low coastal rocks, sand crescent extending narrow between"

✓ "A volcanic shoreline at night with sand pockets between black-lava arms extending into the dark water"

✗ BAD — named place: "Bora Bora lagoon at night" (BANNED — say "Polynesian motu lagoon at night")
✗ BAD — light source: "Beach with bright moon overhead" (BANNED — that's light_source axis)
✗ BAD — sky: "Beach under starry sky" (BANNED — night_sky axis)
✗ BAD — human-built: "Beach with tiki torches" (BANNED — no man-made)
✗ BAD — bioluminescent: "Beach with glowing waves" (BANNED — sci-fi trigger)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Tropical-beach-at-night setting only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
