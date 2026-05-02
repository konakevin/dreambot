#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dollhouse_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `Write ${n} dollhouse-life cozy-domestic lighting + atmosphere descriptors for ToyBot's dollhouse-life path. Each entry combines miniature-interior lighting + ambient warmth + atmospheric detail. 10-20 words per entry.

━━━ THE WORLD ━━━
Dollhouse-scale miniature interiors — Victorian parlors, modern kitchens, nurseries, libraries, garden-rooms, bathrooms, bakery shops, music-rooms, dining-rooms, attics, greenhouses, tea-rooms, studies, porches, playrooms, cottage hearths, bedrooms.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS / multiple TIMES OF DAY
- Mix MORNING / AFTERNOON / EVENING / NIGHT roughly equally
- Mix WARM (lamp/fireplace/candle) with COOL (window-light/moonlight)
- Always cozy-storybook in tone (no grim/dark)

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- Victorian-parlor fringed-lamp warm-amber pool of light, dust-motes in afternoon-window beam
- modern-kitchen morning sun, syrup-amber on butcher-block, steam rising from kettle
- nursery nightlight cool-cyan, mobile-shadows on wall, moonlit-window across crib
- library-nook reading-lamp warm pool, leather-armchair shadows, rain on diamond panes
- garden-room sunbeam through glass-roof, pollen-haze drifting, golden-hour warmth
- bathroom clawfoot-tub afternoon, suds-bubble reflections, frosted-window soft glow
- bakery-shop morning, flour-dust in shaft of light, golden glow on display-case treats
- music-room candlelight on piano, sheet-music glowing amber, dust in low-angle beam
- dining-room dinner-time chandelier, plate-shimmer on tablecloth, candle-flicker on faces
- attic single-bulb hanging, dust-motes thick, gable-window late-afternoon shaft
- greenhouse late-afternoon golden, condensation on glass, plant-shadows on stone-floor
- tea-room lace-curtains diffused light, doily-shadows, china-set sparkle
- study banker's-lamp green-shade pool, dark walnut shadows, fireplace flicker beyond
- porch summer-twilight fairy-lights, citronella candles, lemonade-pitcher condensation
- playroom afternoon sun through window, toy-shelf shadows, dust-motes in shaft
- cottage-hearth fireplace flicker, knit-rug warm shadows, snow-window beyond
- bedroom moonlit-window cool-silver, bedspread shadows, twinkling city-lights distant
- Victorian bedroom four-poster lace-canopy, candle-cluster warm, nightcap-shadow on wall
- modern-living-room evening lamp-pool, TV-glow flicker, knit-throw warm
- cottage-kitchen wood-stove glow, copper-pot shimmer, steaming-kettle haze
- library-cathedral stained-glass rainbow-light, dust-motes, vaulted-ceiling shadows
- antique-shop fringed-lamp warm, knickknack-shadows, dust-thick afternoon
- bookstore-cafe pendant-warm, latte-steam haze, leather-chair shadows
- cottage-bedroom canopy-bed lace-shadow, fireplace flicker, snow-window cold
- modern-minimalist living-room track-lighting cool, sun through floor-to-ceiling window
- empty schoolroom afternoon, dust-motes in shaft, blackboard-shadow, clock-tick warm
- tea-shop counter pendant-warm, china-display sparkle, fringed-lamp pools
- cozy reading-loft fireplace warm, mini-armchair shadow, scale-bookshelf golden
- empty tailor-shop afternoon, dress-form silhouette, fabric-bolt shadows, dust
- toy-shop interior pendant-soft, mini-rocking-horse shadow, dust-haze warm
- cottage-bathroom-afternoon, frosted-glass diffused, dried-flowers in scale-jar shadow
- kitchen-island pendant-pool, fruit-bowl shadow, sun through window beyond
- Victorian-music-room candelabra-cluster, mini-piano shadow on wall, lace-curtain diffuse
- library-hallway runner-rug, banker's-lamp at end of corridor, fading shadows
- empty playroom dawn-pink window, toy-chest shadow, scale-toys in soft-light

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases, miniature-interior + light + atmosphere:
- "Victorian-parlor fringed-lamp warm-amber pool, dust-motes in afternoon-window beam, doily-shadows"
- "nursery nightlight cool-cyan, mobile-shadows on wall, moonlit-window cast across crib"
- "garden-room sunbeam through glass-roof, pollen-haze drifting, golden-hour warmth on stone-floor"

━━━ BANNED ━━━
- Grim / dark / horror tones
- Generic "cozy lighting" without specifying interior + light + atmosphere
- Outdoor-only scenes (these are INTERIOR-focused)
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share INTERIOR-TYPE + LIGHT-SOURCE + TIME-OF-DAY exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
