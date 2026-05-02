#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cuddle_plush_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `Write ${n} CUDDLEBOT plush-world ULTRA-CUTE cozy lighting + atmosphere descriptors. Each entry combines cozy environment + light quality + atmospheric phenomenon. Slight Sanrio / Hello-Kitty / Pusheen / Studio-Ghibli kawaii nudge — softer, dreamier, rosier than typical storybook. 10-20 words per entry.

━━━ THE WORLD ━━━
Plush stuffed-animal cozy adventures — forest campsites, picnic meadows, sailboats, attic bedrooms, treehouses, tea gardens, snow forts, library nooks, garden plots, beach coves, mountain ridges. Cuddlebot brand: cute-cozy-cuddly maximalism.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS, multiple TIMES OF DAY
- Mix indoor cozy + outdoor adventure
- ALWAYS storybook-warm, ULTRA-CUTE, never grim
- Each entry should evoke "AWWW" — gentle, sweet, dreamy

━━━ CUTE NUDGE — APPLY EVERY ENTRY ━━━
- pastel pink / rose-gold / lavender / butter-cream / mint-cream / cotton-candy palette
- sparkles / glitter / shimmer / fairy-dust / firefly drift
- soft-rounded light pools (no harsh shadows)
- "blushing" warmth — light feels affectionate

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- forest-campfire pink flicker, ember-rose, pollen drifting in pastel firelight
- treehouse fairy-lights with pink-bulbs, cotton-candy dusk-sky beyond, dreamy sparkles
- attic dust-motes in rose-gold window-shaft, late-afternoon honey-pink, slow-floating particles
- picnic-meadow rose-golden-hour, dandelion-fluff drifting, blush-amber grass-tips
- bedroom moonlit window with lavender-silver glow, twinkling pastel city-lights
- snowfall-window cottage interior, hearth-rosy-glow vs pastel-blue snow outside
- rainy-afternoon library, pink-lamp-warm pool, pastel-raindrops on diamond panes
- garden-greenhouse rose-gold-hour, sun through glass-panels, pollen-haze drifting
- meadow midmorning summer, butterfly-haze, pollen-glints, blush-amber light
- tea-garden lantern-string dusk, pink-paper-lantern glow, fragrance-mist visible
- snow-fort lavender-blue-hour, snow-reflecting twilight cyan-pink, breath-frost shimmer
- treehouse storm-night, pink-lantern flickering, rain-sheet beyond canopy, cozy-dry
- beach-cove sunrise pink-gold, salt-mist rising, candy-spray surf, sand-warm cream
- autumn-orchard mid-morning, leaf-flutter haze, crisp-rose light, frost-on-grass
- spring-blossom petal-flurry, breeze-stirred dapples, pastel-pink suspended pollen
- midsummer-night fireflies, sequin-spark drift, deep-cyan-purple sky, cricket-warmth
- snowy-village twilight, woven-pink-roofs lit yellow windows, falling snow in lantern-light
- aurora-borealis night, soft pink-green veil, snowfall reflecting cyan-rose, lantern warmth
- moonlit-pond surface, water-reflection shimmer, dragonfly silhouettes, pink-cattail haze
- fireplace-cottage night, flicker-shadows on knit-rug, hot-cocoa-steam pastel drift
- music-room candlelight, sheet-music glowing rose-amber, dust in low-angle pink beam
- harvest-moon-night autumn, pink-orange-orb low on horizon, pumpkin-glow nearby
- snow-globe interior, glitter-flakes suspended, soft pearlescent overall, dreamy
- library cathedral-window stained-glass, rainbow-pastel light on knit-floor, dust-motes
- bedside lamp pink-blush, soft pillows reflecting warmth, pastel quilt-shadows
- cottage-window dawn-pink, climbing roses outside, dewdrop-sparkle on petals
- orchard-tea-table lavender-twilight, fairy-lights strung between trees, blush-mauve sky

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases. Always cute-cozy:
- "forest-campfire pink flicker dusk, ember-rose drift, pollen sparkles in golden flame-light"
- "attic dust-motes in rose-gold window-shaft, late-afternoon honey-pink, slow-floating particles"
- "snowy-village twilight, woven-pink-roofs glowing yellow windows, snow falls catching lantern-light"

━━━ BANNED ━━━
- Grim / dark / horror / battle tones
- Generic "cozy lighting" without specifying environment + light + atmosphere
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share ENVIRONMENT + TIME-OF-DAY + ATMOSPHERIC-PHENOMENON exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
