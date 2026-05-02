#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_weather.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `Write ${n} weather + season + time-of-day + atmospheric-lighting descriptors for HO-scale model-railroad dioramas. Each entry = ONE specific atmospheric mood combining weather phenomenon + light quality + season. 10-20 words per entry.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS roughly equally (spring / summer / fall / winter)
- Cover all TIMES OF DAY (dawn / morning / noon / afternoon / golden-hour / dusk / blue-hour / night / midnight / pre-dawn)
- Mix DRAMATIC and CALM weather

━━━ WEATHER TO ROTATE ━━━
- light snowfall / heavy snowstorm / blizzard whiteout / frost-bitten morning
- light rain / steady rain / heavy downpour / monsoon flood / drizzle
- thunderstorm with lightning / distant thunderhead clouds / post-rain steam
- ground fog rolling / valley mist / morning fog burning off / coastal fog bank
- desert heat-shimmer / dust-cloud blowing / sandstorm haze
- alpine clear-cold / mountain wind / hailstorm ice-pebbles
- prairie thunderhead / tornado-funnel distant / downburst gust
- harvest-haze / autumn mist / leaf-flurry wind
- spring rain on blossoms / petal-flurry breeze
- summer haze / hot-tar shimmer / cloudless azure
- arctic ice-fog / hoarfrost / frozen-breath crystallize
- aurora borealis night / harvest-moon clear / new-moon star-dense
- cathedral dawn rays / golden-hour streamers / sun-shaft through trees
- blue-hour twilight / civil-dusk hush / pre-dawn cobalt
- overcast flat / leaden sky / pewter low-clouds
- spring snowmelt / mud-season thaw / frost-on-rails

━━━ LIGHTING QUALITY TO LAYER ━━━
- warm golden / cool silver / pewter overcast / amber sodium / cyan moonlight
- low-angle long-shadow / overhead noon-flat / backlit silhouette
- diffused gloom / shaft-of-light / godrays through canopy
- lit window-glow against dusk / sodium-yellow station-lamp
- starlight only / moon-rim only / lantern-only

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases, written as direct atmospheric direction. Include season + time + weather + lighting in each entry:
- "winter blizzard whiteout, late-afternoon flat-pewter sky, snow-flurries obscuring distant terrain, depot lit-windows glowing warm"
- "autumn golden-hour, low warm sun streamers through bare branches, ground-fog at track-base, breath-frost visible"
- "summer thunderstorm dusk, distant lightning fork, sheet-rain curtain, sodium station-lamp cutting through downpour"
- "spring dawn fog, valley shrouded in cool silver mist, sun-shaft breaking through, dewdrops catching light"
- "mid-summer cloudless noon, hot-tar heat-shimmer rising off rails, cobalt-blue sky, hard short shadows"
- "aurora-borealis night, green-veil dancing overhead, snow reflecting cold cyan, station-lamp warm contrast"

━━━ BANNED ━━━
- Generic "atmospheric" without specifying weather + season + time + light
- Identical entries
- Pure narrative without atmospheric direction

━━━ DEDUP RULE ━━━
- No two entries share SEASON + TIME + WEATHER combo exactly
- Vary across the ${n} entries

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
