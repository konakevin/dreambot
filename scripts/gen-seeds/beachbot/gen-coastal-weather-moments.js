#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/coastal_weather_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} WEATHER + LIGHTING MOMENT descriptions for BeachBot. Each entry describes a specific weather condition, time of day, or lighting scenario on a TROPICAL beach or coast. These set the mood and atmosphere for beach renders.

Each entry: 15-25 words. One specific weather/lighting moment with visual detail.

━━━ DISTRIBUTION (follow closely) ━━━

GOLDEN/SUNSET (~20%):
- Golden hour spreading across sand, long shadows, honey-warm light
- Blazing sunset igniting clouds, silhouetted palms, crimson horizon
- Soft peach-pink sunset, diffuse warm glow, no harsh shadows
- Sunset afterglow cycling through salmon, mauve, violet, indigo

NIGHT/MOONLIT (~20%):
- Full moon silver pathway across calm ocean, everything blue-silver
- Crescent moon low over water, stars dense, gentle glow
- Tiki torches lining shoreline, warm flickering firelight on wet sand
- Paper lanterns in palm trees, amber pools of light on evening beach
- Fire pit embers on night sand, sparks drifting, warm glow catching palms
- Bioluminescent waves, electric blue-green glow pulsing with each breaker
- Starlit beach, Milky Way overhead, faint shimmer on dark water

SOFT/DREAMY (~20%):
- Early morning fog hugging water surface, sun a pale disc, everything dreamlike
- Morning mist burning off slowly, soft golden columns of light
- Iridescent mother-of-pearl sky after rain, pastel pink and lavender reflections
- Overcast diffuse light, no shadows, soft even glow, pearl-grey sky
- Thin cloud veil softening afternoon sun, everything glowing without hard edges

DAWN/SUNRISE (~15%):
- Pre-dawn pink glow on eastern horizon, stars fading above dark surf
- Golden sunrise piercing mist banks, layered amber and grey
- First light catching wave crests, beach still in cool blue shadow
- Rose-gold sunrise reflected perfectly in glassy calm water

DRAMATIC (~15%):
- Crepuscular rays bursting through storm clouds, light shafts across ocean
- Dark storm cell on horizon trailing rain curtains, sunny foreground
- Rainbow arcing from sea to cliff after passing squall
- Lightning illuminating distant thunderstorm, purple-white flash over dark ocean
- Tropical squall approaching, wind picking up, dramatic light contrast

SHIMMER/SPECIAL (~10%):
- Green flash atop setting sun's disk, rare optical moment
- Sun breaking through rain, entire scene sparkling with backlit droplets
- Double sun-dog halos flanking afternoon sun, prismatic coastal light
- Tropical dusk with Venus bright above horizon, coral glow at waterline

━━━ TONE ━━━
These are TROPICAL beaches — NO arctic, ice, freezing, hail, winter, sandstorm, or hostile weather. Keep it warm, inviting, magical. Even storms should feel dramatic and beautiful, not harsh or cold.

━━━ NO PEOPLE ━━━
No humans, swimmers, surfers, fishermen. Objects OK (tiki torches, lanterns, boats, fire pits).

━━━ DEDUP ━━━
Each entry must be a DIFFERENT lighting/weather combination. No two entries describing the same time of day with the same conditions.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
