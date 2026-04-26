#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cozy_anime_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY ANIME MOMENT descriptions for MangaBot's cozy-anime path — Ghibli-warm heartwarming slower-paced vignettes. Totoro / Ponyo / Kiki / Whisper of the Heart energy.

Each entry: 15-30 words. One specific Ghibli-warm cozy moment.

━━━ CATEGORIES ━━━
- Rain moments (spirit + girl under umbrella at bus stop Totoro-style, rain on glass reading nook, rain-on-window cat watching)
- Tea and food (forest-spirit drinking tea in cottage, old-woman stirring soup at hearth, kotatsu with cat sleeping on top)
- Window vignettes (girl + cat at window pondering garden, rain-streaked window with tea-cup, sunny windowsill with herb pots)
- Cozy domestic (patchwork-quilt bedroom, sun-dappled kitchen with oven-warmth, old woman's cottage interior)
- Forest-spirit warmth (small spirits gathered around fire, forest-creatures sharing a meal, spirit-fox curled beside candle)
- Rainy-day scenes (gallery of umbrellas in shop window, rain-bead chandelier in attic)
- Childhood-memory warmth (child in oversized sweater watching stars, kid + grandparent fishing in river)
- Festival-downtime (lantern aftermath, festival-worker eating late noodle, children counting coins from game)
- Kitchen-magic (steam rising from pot with spirit watching, dumpling-making with forest-spirit assistance)
- Animal companions (cat on bookshelf beside reading girl, dog napping on mat)
- Quiet reading nooks (bench in library by window, curled-up chair in sunlight)
- Garden-shed interiors (tools, herbs hanging, warm afternoon light)
- Old-lady + cat knitting scene
- Hearth + cauldron bubbling warm
- Night-sky porch-swing with lantern

━━━ RULES ━━━
- Ghibli-warm aesthetic, slower-paced, heartwarming
- Include SPECIFIC Ghibli-esque detail (kotatsu, spirit, old tea-kettle, rain on window)
- No intense/dark — always cozy, comforting, gentle
- Characters can be by-role (forest-spirit, old-woman, schoolgirl)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
