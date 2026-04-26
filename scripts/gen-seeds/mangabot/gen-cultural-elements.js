#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cultural_elements.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} JAPANESE CULTURAL ELEMENT descriptions for MangaBot — specific cultural details that add authenticity and visual richness to any scene. Stackable accent elements.

Each entry: 6-14 words. One specific cultural element.

━━━ CATEGORIES ━━━
- Shrine elements (torii gates, shimenawa rope, komainu stone lions, ema wooden plaques, ofuda paper talismans)
- Paper lanterns (chōchin paper lanterns, andon standing lanterns, tōrō stone lanterns)
- Festival elements (tanabata tanzaku paper strips, bon-odori dance, mikoshi portable shrine)
- Kitsune masks (fox masks, oni masks, kabuki masks)
- Origami elements (paper cranes strung, origami koi)
- Tea-ceremony tools (chasen whisk, chawan bowl, kama iron pot)
- Wagashi confections (mochi, dango on skewer, manju, dorayaki)
- Clothing elements (kimono obi sash, haori jacket, geta wooden sandals, jinbei summer wear, fundoshi)
- Weapons / armor (katana sheathed, naginata polearm, samurai kabuto helmet, sashimono banner)
- Calligraphy (shodō brush ink and paper, enso circle)
- Tea ceremony elements (tatami mat with tea-setup, wabi-sabi aesthetic)
- Zen garden details (raked gravel patterns, carefully placed stones)
- Rain gear (traditional wooden umbrellas, straw kasa hats)
- Household (shoji paper door, tokonoma alcove with scroll, futon bedding, kotatsu)
- Transportation (traditional boats, rickshaw, bicycle, tram)
- Food-culture (bento boxes, ramen bowls, sushi platters, yakitori skewers on grill)
- Writing (manga panels, kanji calligraphy, haiku scrolls)
- Music (shamisen, koto, taiko drums)
- Dance-culture (geisha fan, sakura-odori)
- Architecture-details (engawa porch, roof-tiles, pagoda-tiers)

━━━ RULES ━━━
- Authentic Japanese cultural items
- Visual-focused so they render well
- Stackable — these scatter into other scenes
- No anime-IP specific items

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
