#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cuddle_dollhouse_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} CUDDLEBOT dollhouse-life ULTRA-CUTE cozy-domestic lighting + atmosphere descriptors. Each entry combines miniature-interior lighting + ambient warmth + atmospheric detail. Slight Sanrio / Pusheen / Hello-Kitty kawaii nudge — softer, dreamier, rosier than typical cozy interior. 10-20 words per entry.

━━━ THE WORLD ━━━
Cuddlebot dollhouse-scale miniature interiors — Victorian parlors, modern kitchens, nurseries, libraries, garden-rooms, bathrooms, bakery shops, music-rooms, dining-rooms, attics, greenhouses, tea-rooms, studies, porches, playrooms, cottage hearths, bedrooms. ULTRA-CUTE with plushie-creature inhabitants.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS / multiple TIMES OF DAY
- Mix MORNING / AFTERNOON / EVENING / NIGHT roughly equally
- Mix WARM (lamp/fireplace/candle) with COOL (window-light/moonlight)
- Always cute-storybook tone, never grim

━━━ CUTE NUDGE — APPLY EVERY ENTRY ━━━
- pastel pink / rose-gold / lavender / butter-cream / cotton-candy / mint-cream palette
- sparkles / shimmer / fairy-dust drifting
- soft-rounded light pools (no harsh shadows)
- "blushing" warmth — light feels affectionate

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- Victorian-parlor pink-fringed-lamp warm rose-amber pool, dust-motes in afternoon-window beam
- modern-kitchen pastel morning sun, syrup-amber on butcher-block, steam rising rosy
- nursery nightlight cool-cyan-lavender, mobile-shadows on wall, moonlit-window across crib
- library-nook reading-lamp warm pink pool, leather-armchair shadows, pastel rain on diamond panes
- garden-room sunbeam through glass-roof, pollen-haze drifting golden-pink, rose-gold warmth
- bathroom clawfoot-tub afternoon, suds-bubble sparkle reflections, frosted-window soft pink-glow
- bakery-shop morning, flour-dust in shaft of light, golden-pink display-case treats
- music-room candlelight on piano, sheet-music glowing rose-amber, dust in low-angle pink beam
- dining-room dinner-time chandelier, plate-shimmer on tablecloth, candle-flicker on faces
- attic single-bulb warm-pink hanging, dust-motes thick, gable-window late-afternoon shaft
- greenhouse late-afternoon golden-pink, condensation on glass, plant-shadows on stone-floor
- tea-room lace-curtains diffused pink-light, doily-shadows, china-set sparkle
- study banker's-lamp green-pink-shade pool, dark walnut shadows, fireplace flicker beyond
- porch summer-twilight fairy-lights, citronella-pink candles, lemonade-pitcher condensation
- playroom afternoon sun through window, toy-shelf shadows, dust-motes in pink shaft
- cottage-hearth fireplace flicker, knit-rug warm shadows, snow-window pastel-blue beyond
- bedroom moonlit-window cool-lavender-silver, bedspread shadows, twinkling city-lights distant
- Victorian bedroom four-poster lace-canopy, pink-candle-cluster warm, nightcap-shadow on wall
- modern-living-room evening lamp-pool, TV-glow flicker, knit-throw warm pastel
- cottage-kitchen wood-stove glow, copper-pot shimmer, steaming-kettle pink-haze
- library-cathedral stained-glass rainbow-pastel light, dust-motes, vaulted-ceiling shadows
- antique-shop pink-fringed-lamp warm, knickknack-shadows, dust-thick pastel afternoon
- bookstore-cafe pendant-warm pink, latte-steam haze, leather-chair shadows
- cottage-bedroom canopy-bed lace-shadow, fireplace flicker, snow-window pastel-cold
- modern-minimalist living-room track-lighting cool-pink, sun through floor-to-ceiling window
- tea-shop counter pendant-warm pink, china-display sparkle, fringed-lamp pools
- cozy reading-loft fireplace warm rose-gold, mini-armchair shadow, scale-bookshelf golden
- toy-shop interior pendant-soft pink, mini-rocking-horse shadow, dust-haze warm
- cottage-bathroom-afternoon, frosted-glass diffused pastel, dried-flowers in scale-jar shadow
- kitchen-island pendant-pool warm-pink, fruit-bowl shadow, sun through window beyond
- Victorian-music-room candelabra-cluster, mini-piano shadow on wall, lace-curtain pink diffuse
- library-hallway runner-rug, banker's-lamp at end of corridor, fading shadows pink
- empty playroom dawn-pink window, toy-chest shadow, scale-toys in soft pink-light

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases:
- "Victorian-parlor pink-fringed-lamp warm rose-amber pool, dust-motes in afternoon-window beam, doily-shadows"
- "nursery nightlight cool-lavender, mobile-shadows on wall, moonlit-window cast across crib"
- "garden-room sunbeam through glass-roof, pollen-haze drifting rose-gold, golden warmth on stone-floor"

━━━ BANNED ━━━
- Grim / dark / horror tones
- Generic "cozy lighting" without specifying interior + light + atmosphere
- Outdoor-only scenes
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share INTERIOR-TYPE + LIGHT-SOURCE + TIME-OF-DAY exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
