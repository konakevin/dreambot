#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_weather_air.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} WEATHER + AIR entries for a MangaBot ghibli-painterly keyframe. This is ATMOSPHERIC DEPTH — mist / dust-motes / sunbeams / wind / particle-haze — that gives the scene its sense of distance and lived-in air. Different from cascade_motion (which is the drift-element) — this is the AMBIENT AIR QUALITY.

Each entry: 10-18 words. ONE specific atmospheric quality. Ghibli painterly cue — depth-haze, sun-particles, weather.

VARIETY (25 bespoke entries):
- 20% MORNING MIST / FOG rolling through the scene (low atmospheric haze)
- 20% DUST-MOTES suspended in sun-shaft beams
- 15% LIGHT RAINSHOWER drifting across the landscape
- 10% WIND-BLOWN sense (banners flutter, trees lean, hair stirred)
- 10% HUMID HEAT-HAZE in summer-warm scene
- 10% LIGHT SNOW dusting / drifting
- 5% AFTER-RAIN STILLNESS with puddle-reflections + crystal air
- 5% STORM-DISTANT approaching with clouds piling
- 5% SUNSET BACKLIGHT with silhouettes against amber sky

DO write:
- Morning mist rolls in low ribbons through the colonnade, hazing the deeper architecture in silver
- Suspended dust-motes drift slowly through the slanting god-ray sunbeams, golden particles in the air
- Light drifting rainshower hangs across the cliff face, softening edges and pearling distant surfaces
- Wind stirs the hanging banners and lifts the foreground petals, a sense of motion in the still air
- Humid summer heat-haze warps the deep distance slightly, sun-baked stones radiating warmth
- Light snow dusts the eaves and drifts in lazy spirals, settling on the moss and stone-step
- After-rain stillness with mirror-puddles reflecting the spire, crystal-clear washed air
- A distant storm approaches with piled thunderheads at the horizon, sun still bright on the foreground
- Backlit sunset silhouettes the architecture against amber sky, foreground in shadow

DO NOT write:
- Photoreal weather report
- Hero-character close-up
- Flat / empty / featureless air
- Western weather references

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
