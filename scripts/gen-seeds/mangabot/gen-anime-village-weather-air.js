#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_weather_air.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} WEATHER-AND-AIR entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names a SPECIFIC atmospheric / weather condition that wraps the village in mood + atmospheric depth. Aerial perspective haze IS encouraged; volumetric fog should be specific not vague.

Each entry: 12-22 words. ONE specific weather + air condition. Adds depth via atmospheric perspective.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD weather conditions (mountain mist / paddy-morning fog / monsoon)
- 40% MODERN-JAPAN weather (rain-puddle reflections / vending-machine glow on damp street)

WEATHER-AIR VARIETY:
- Golden-hour haze over the village rooftops (late-amber atmosphere)
- Morning mist rolling over paddies (low ground-fog softening the village edge)
- Sudden rainshower drumming on kawara tiles (slate-grey downpour)
- Dust-mote sunbeam slicing through an alley (Showa-era ray-of-light through power-cables)
- Evening-blue mist drifting between cottages (cobalt twilight haze)
- Typhoon-windblow rustling banners (wild laundry-flap, leaves whipping)
- First-snow softening every edge (fresh-flake quiet over Shirakawa-go eaves)
- Sakura-blizzard tumbling across the lane (pink-petal storm between buildings)
- Monsoon-puddle stillness after rain (reflective glass-pools across cobble)
- Distant thunder-cloud building over a mountain village (charcoal sky to north)
- Cool dawn-fog veiling the temple roof (silver-blue haze at low altitude)
- Steam-cloud rising from an onsen rooftop (white-vapor against twilight)
- Showa-era neon-glow softened by drizzle (kanji-light bleeding through wet air)
- Cherry-petal drift mixed with light rain (pink raft across puddle)
- Dry autumn wind blowing leaf-cyclones through alley (warm-gold whirl)
- Cool damp twilight after rain (slick cobble, lantern-reflection)
- Heat-shimmer haze across midsummer paddies (vertical mirage)
- Crisp winter-clarity with mountain wind (sharp blue clarity, breath visible)
- Drizzle catching kissaten neon (mid-century rain-glow)
- Heavy fog veiling the lighthouse hamlet (cottages dissolving at distance)
- Frost-crisp dawn at a mountain-pass village (every roof tile rimed silver)
- Pre-storm sky building over a fishing hamlet (charcoal cumulus piling up)
- Late-afternoon golden-rim light slanting through the lane (warm shadow-cast)
- First-light pink-grey haze creeping along the river-bend (Mushishi-register dawn)
- Humid summer-evening air shimmering between vending machines (Showa neon-glow halo)

DO write:
- Golden-hour haze over the rooftops, late-amber light gilding every kawara tile
- Morning mist rolling low across the paddies, the village edge softening into silver-blue
- A sudden rainshower drumming on clay tiles, slate-grey downpour blurring the lane
- Dust-mote sunbeams slicing through a Showa alley, Tyndall-rays cutting power-cable shadows
- A typhoon wind rustling banners and laundry, leaves whipping across the cobble
- First-snow softening every edge of Shirakawa-go eaves, hush over the gassho hamlet
- Sakura-blizzard tumbling across the lane, pink-petal storm between dark-wood buildings

DO NOT write:
- Negation language ("no fog", "without haze") — Flux ignores "no" and renders the word
- Generic "atmospheric" without specificity
- Combat / dramatic / apocalyptic weather
- Modern megacity smog
- Multiple weather conditions per entry (pick ONE)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
