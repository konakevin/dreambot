#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for CoquetteBot — pink-dominant pastel palettes. Always romantic / feminine / dreamy.

Each entry: 10-20 words. One specific pink-pastel palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Pink + cream + rose-gold
- Blush + peach + butter-yellow + cream
- Rose + pearl + lavender + cream
- Sakura-pink + pale-mint + cream
- Strawberry + cream + pale-pink + gold
- Peach + blush + lavender + cream
- Rose-gold + ivory + blush + soft-peach
- Bubblegum + mint + lavender + cream
- Dusty-rose + sage + pearl + cream
- Magnolia-pink + cream + soft-peach
- Pink-champagne + pearl + cream + gold-dust
- Rose-quartz + seafoam + cream + pearl
- Cotton-candy + baby-blue + cream
- Lavender-rose + pearl + warm-cream
- Honey-peach + pink + cream + soft-gold
- Strawberry-shortcake (berry + cream + pale-pink + mint)
- Ballerina-pink + white + rose-gold + pearl
- Parisian-pastry (macaron-pastel mix)
- Rose-garden (multiple rose shades + green + gold)
- Sunset-rose (rose-gold + peach + cream + lavender)
- Spring-meadow (pastel-pink + butter + mint + cream)
- Cherry-blossom (sakura-pink + cream + soft-brown + mint)

━━━ RULES ━━━
- Pink always present
- 3-5 specific color words per entry
- Supporting pastels: cream / blush / rose-gold / peach / lavender / mint / butter-yellow / pearl

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
