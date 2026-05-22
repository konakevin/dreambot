#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_time_of_day.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} TIME-OF-DAY entries for a MangaBot samurai-era keyframe. Each entry is PURE TIME REGISTER — what time it is + the sky/atmosphere register that comes with it. Decoupled from the light source (that's a separate axis).

Each entry: 8-16 words. Names the time + sky color register + brief atmospheric note.

Distribution across 50:
- 18% PRE-DAWN / DAWN — pale blue-pink sky, cool air, mist
- 18% GOLDEN HOUR / SUNSET — warm gold-amber, copper, peach skies
- 18% MIDDAY — clear bright sky, full daylight, soft shadows
- 14% BLUE HOUR DUSK — deep cobalt-violet sky, first lanterns lit
- 10% MIDNIGHT — inky black sky, stars, full moon, deep shadows
- 8% OVERCAST STORM — grey-purple cloud cover, pre-rain charged air
- 8% RAIN — slate-grey wet sky, drizzle-haze across the scene
- 6% FOG / MIST DAWN — opaque white-grey sky, visibility softened to layers

DO write:
- Pre-dawn pale blue sky with cool mist hanging low across the valley
- Golden hour sunset, warm-copper sky burning across the mountain ridges
- Clear midday with high sun and crisp blue sky, soft shadows on stone
- Deep blue-hour dusk, cobalt sky overhead, first stone-lanterns lit on the path
- Midnight under a full moon, ink-black sky with silvered cloud-edges

DO NOT write:
- Specific lighting direction or source (separate axis — "sun-shaft" / "lantern-halo" etc.)
- Weather effects beyond sky-condition (rain-streaks / petals drifting — that's atmospheric_element axis)
- Photoreal sky tech (HDR / bloom)
- Vague "early" / "late" — every entry should NAME the time-of-day clearly
- Modern sky-objects (aircraft, satellites, contrails)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
