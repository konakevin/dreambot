#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/weather_phenomena.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EXTREME WEATHER SPECTACLE descriptions for EarthBot — dramatic atmospheric events that showcase Earth's raw meteorological power.

Each entry: 15-25 words. One specific weather phenomenon in a specific setting. No people.

━━━ CATEGORIES (mix across all) ━━━
- Supercell thunderstorms (rotating mesocyclones, wall clouds, mammatus-lined anvils, green-tinted skies)
- Aurora borealis and australis (curtains, pillars, coronas, rare red aurora, reflected in still water)
- Lightning storms (spider lightning, bolt-to-ground over plains, volcanic lightning, ball lightning)
- Monsoon walls (haboob dust walls, monsoon cloud fronts, rain curtains sweeping across valleys)
- Fog banks (advection fog rolling through Golden Gate, valley fog filling basins, tule fog)
- Sun dogs and halos (parhelia, 22-degree halos, circumzenithal arcs, light pillars in ice fog)
- Waterspouts and dust devils (oceanic waterspouts, fair-weather spouts, towering dust devils)
- Lenticular clouds (stacked lenticulars over peaks, iridescent lenticulars, wave clouds)
- Tornadoes and severe weather (rope tornadoes at sunset, wedge tornadoes on open plains)
- Blizzards and ice storms (whiteout conditions, ice-encased trees, wind-driven snow walls)
- Double and full rainbows (supernumerary bows, fogbows, moonbows, reflected rainbows)
- Volcanic weather (pyrocumulus towers, ash-laden sunsets, volcanic vog)

━━━ RULES ━━━
- Each entry captures ONE dramatic weather moment in a specific landscape
- Real meteorological phenomena only — no fantasy weather
- Mix seasons, latitudes, and times of day across entries
- No two entries should describe the same phenomenon in the same setting
- 15-25 words each — visceral, specific, awe-inspiring language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
