#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/city_camera_angles.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CITY-SCALE CAMERA ANGLE descriptions for StarBot's alien-city path — cinematic framings specifically designed for vast alien cityscapes. 15-25 words each.

━━━ WHAT THESE ARE ━━━
Each entry describes a camera position and framing that shows an ALIEN CITY at its best. These are about WHERE you are relative to the city and HOW MUCH of it you see. They get injected into city scene prompts to force variety in how the city is revealed to the viewer.

━━━ CITY FRAMING CATEGORIES (spread EVENLY — max 2 per category) ━━━
1. Orbital/satellite view — looking straight down from extreme altitude, city as pattern on planet surface, geographic scale
2. High aerial/bird's-eye — sweeping overhead, city sprawl visible edge to edge, like flying over it
3. Approaching from distance — city on the horizon, first glimpse across desert/ocean/ice field, sense of arrival
4. Perimeter/edge view — standing at the city boundary where architecture meets wilderness, transition zone
5. Elevated overlook — from a ridge, hill, or cliff above the city, looking down and across the full skyline
6. Skyline panorama — eye-level or slightly elevated, horizontal sweep of the city profile against alien sky
7. Canyon/street level looking up — deep inside the city, towering structures rising on all sides, vertigo scale
8. Plaza/courtyard — at ground level in an open space, surrounded by architecture, sky visible above
9. Bridge/causeway crossing — mid-span of a massive structure connecting city sections, depth in both directions
10. Rooftop/terrace — atop one structure looking across at others, mid-city altitude, intimate but panoramic
11. Through a gap/archway — city revealed through a natural or architectural opening, framed vista
12. Ascending/descending — looking up or down a vertical axis through stacked city layers, infinite depth
13. Waterfront/harbor — city rising from liquid (water, mercury, lava), reflections doubling the skyline

━━━ DEDUP ━━━
No two entries should share the same altitude + viewing direction + distance to city:
- ALTITUDE: orbital, high aerial, elevated, eye-level, below-grade
- DIRECTION: looking down, looking across, looking up, looking along
- DISTANCE: extreme far, approaching, perimeter, mid-city, deep inside

━━━ RULES ━━━
- Describe ONLY camera position and framing relative to the city — NOT city content or architecture style
- Include how much of the city is visible (full sprawl vs. single district vs. one street)
- These must sell SCALE — the city should feel impossibly vast from every angle
- 15-25 words per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
