#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} plush-world cozy-storybook lighting + atmosphere descriptors for ToyBot's plush-world path. Each entry combines cozy environment + light quality + atmospheric phenomenon. 10-20 words per entry.

━━━ THE WORLD ━━━
Plush stuffed-animal cozy adventures — forest campsites, picnic meadows, sailboats, attic bedrooms, treehouses, tea gardens, snow forts, library nooks, garden plots, beach coves, mountain ridges.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS roughly equally
- Mix indoor cozy + outdoor adventure
- Mix DAY / DUSK / NIGHT roughly equally
- ALWAYS storybook-warm in tone (no grim/dark/battle)

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- forest-campfire flicker, ember-rise, pine-needle pollen drifting in firelight
- treehouse fairy-lights string, dusk-blue sky beyond leaves, warm-gold dapples
- attic dust-motes in window-shaft, late-afternoon golden, slow-floating particles
- picnic-meadow golden-hour, dandelion-fluff drifting, warm-amber grass-tips
- bedroom moonlit window, cool-silver bedspread shadows, twinkle of city-lights distant
- snowfall-window cottage interior, hearth-glow warm vs cool-blue snow outside
- rainy-afternoon library nook, lamp-warm pool of light, raindrops on diamond panes
- garden-greenhouse golden-hour, sun through glass-panels, pollen-haze drifting
- meadow-midmorning summer, butterfly-haze, pollen-glints in warm sun
- tea-garden lantern-string dusk, paper-lantern glow, fragrance-mist visible
- snow-fort blue-hour, snow-reflecting twilight cyan, breath-frost visible
- treehouse storm-night, lantern flickering, rain-sheet beyond canopy
- beach-cove sunrise, salt-mist rising, golden-spray surf, sand-warm tones
- autumn-orchard mid-morning, leaf-flutter haze, crisp-clean light, frost on grass
- spring-blossom petal-flurry, breeze-stirred dapples, pastel-pink suspended pollen
- midsummer-night fireflies, sequin-spark drift, deep-cyan sky, cricket-warmth
- snowy-village twilight, woven-roof lit windows, falling snow catches lantern-light
- aurora-borealis night, soft green-veil, snowfall reflecting cyan, lantern warmth contrast
- moonlit-pond surface, water-reflection shimmer, dragonfly silhouettes, cattail haze
- fireplace-cottage night, flicker-shadows on knit-rug, hot-cocoa-steam drift
- music-room candlelight, sheet-music glowing amber, dust in low-angle beam
- harvest-moon-night autumn, orange-orb low on horizon, pumpkin-glow nearby
- snow-globe interior, glitter-flakes suspended, soft pearlescent overall
- library cathedral-window stained-glass, rainbow-light on knit-floor, dust-motes

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases, written as direct atmospheric direction. Always storybook-warm, never grim:
- "forest-campfire flicker dusk, ember-rise, pine-needle pollen drifting in golden flame-light"
- "attic dust-motes in window-shaft, late-afternoon honey-amber, slow-floating particles, warm wood-tones"
- "snowy-village twilight, woven-roof lit-windows glowing yellow, falling snow catches lantern-light"

━━━ BANNED ━━━
- Grim / dark / horror / battle tones
- Generic "cozy lighting" without specifying environment + light + atmosphere
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share ENVIRONMENT + TIME-OF-DAY + ATMOSPHERIC-PHENOMENON exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
