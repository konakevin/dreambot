#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/food_anime.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOOD ANIME scene descriptions for MangaBot — Japanese food culture through anime lens. Food Wars / Sweetness & Lightning / Isekai Izakaya / Laid-Back Camp cooking energy. The FOOD is the star — lovingly rendered, steam rising, glistening.

Each entry: 15-25 words. One specific anime food scene with dish + setting + sensory detail.

━━━ CATEGORIES ━━━
- Ramen shop (counter seat, steaming bowl, noodle pull, broth gleaming, chef focused)
- Street food stall (takoyaki turning, yakitori smoke, festival crowd, paper lanterns)
- Bento box (intricate compartments, rice shaped, tamagoyaki, pickled vegetables, wrapped cloth)
- Sushi counter (chef slicing, fish glistening, wasabi, wooden counter, sake cup)
- Izakaya evening (small plates, beer glasses, warm wood interior, laughter, steam)
- Home cooking (kitchen scene, apron, chopping vegetables, pot simmering, window light)
- Tea and wagashi (matcha whisked, delicate sweets, tatami, ceramic, zen garden view)
- Bakery morning (fresh bread, melon pan, display case, warm oven glow, flour dust)
- Camping cookout (portable stove, curry rice, mountain backdrop, starry sky, steam rising)
- Convenience store late night (onigiri, cup noodles, fluorescent glow, rain outside, solo meal)

━━━ RULES ━━━
- FOOD is hero — rendered with obsessive detail (texture, steam, glisten, color)
- Anime illustration style (Ghibli food-scene energy)
- Setting provides context but doesn't overwhelm the food

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
