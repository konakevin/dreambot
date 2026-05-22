#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_time_of_day.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Heavily night-skewed — neo-tokyo lives at night. Pure time register, decoupled from the specific neon-light source (separate axis).

Each entry: 8-16 words. Names the time + sky color register.

Distribution (~80% night, 20% day-variant):
- 25% DEEP MIDNIGHT (1-3 AM, peak neon, empty-feeling streets)
- 18% RAINSTORM DUSK (early evening, heavy rain, neon coming on)
- 15% BLUE-HOUR DUSK (just after sunset, sky deep cobalt, signs igniting)
- 12% PRE-DAWN (cold pale-blue sky, neon fading, dawn-rim of light)
- 10% 3-AM EMPTY (true late-night, streets mostly empty, all-neon-on)
- 7% NEW-YEAR-EVE RUSH NIGHT (massive crowd-energy, all signage at max)
- 6% TYPHOON EVENING (storm-grey sky, sideways rain, neon punching through)
- 5% SMOG-OVERCAST MIDDAY (yellow-grey ceiling, sun barely visible, sodium daylight)
- 2% DAWN-WITH-FOG (rare day-light entry, low fog at street, sun hidden)

DO write:
- Deep midnight, neon at peak saturation, sky completely black above the signage glow
- Rainstorm dusk, heavy rain falling, signs flickering on, sky still bruised with dying sunset
- Blue-hour dusk, sky deep cobalt-violet, all signs igniting one by one across the cityscape
- Pre-dawn, sky pale blue with a thin pink rim at horizon, signs fading but still glowing
- New Year's Eve rush night, sky black, every sign at maximum saturation, crowd-energy electric
- Smog-overcast midday, yellow-grey ceiling muting the sun, signs dimmed but still on

DO NOT write:
- Sunny / clear midday (the only day variant is smog-overcast or dawn-fog)
- Specific light direction (separate axis)
- Weather details (separate axis — weather_air)
- Multiple times per entry — ONE clear time

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
