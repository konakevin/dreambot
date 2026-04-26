#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for TinyBot — miniature warm palettes.

Each entry: 10-20 words. One specific miniature palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Sunny-warm (honey + cream + amber + soft-gold)
- Cozy-amber (warm-amber + cream + terracotta + deep-wood)
- Dappled-green (emerald + moss + amber-sun + shadow-teal)
- Pastel-soft (blush + mint + cream + butter-yellow)
- Dreamy-peach (peach + rose + cream + soft-gold)
- Storybook-pastel (pastel-pink + butter + mint + cream)
- Cottage-warm (honey + cream + red-roof + green-garden)
- Terrarium-emerald (moss + emerald + cream-glass + amber-mist)
- Bakery-pastel (butter + cream + strawberry + chocolate)
- Library-warm (deep-wood + gold-spine + warm-lamp + cream-page)
- Sunset-miniature (rose-gold + warm-peach + cream + soft-blue)
- Spring-meadow-tiny (pastel-green + yellow-flower + cream + sky)
- Autumn-miniature (rust + honey + pumpkin + cream)
- Winter-cozy-tiny (warm-amber-inside + pale-blue-outside)
- Rainy-day-miniature (grey-window + warm-amber-inside + cream)
- Parisian-cafe (cream + brass + burgundy + warm-wood)
- Tokyo-night-tiny (neon-purple + pink + black + tiny-warm-windows)
- Craftsman-wood-warm (amber-wood + cream + gold + soft-shadow)
- Cherry-blossom-miniature (sakura + cream + pale-mint + gold)
- Harbor-miniature (pale-blue + cream + warm-dock + gold)
- Garden-center-tiny (multi-pastel flowers + cream + warm-wood)
- Ocean-tide-pool-miniature (teal + coral + pearl + emerald)
- Nursery-soft (soft-pink + butter + mint + cream)
- Workshop-warm (deep-wood + amber-lamp + cream + brass)
- Market-bright (saturated-produce-colors + warm-wood)
- Tuscan-miniature (terracotta + honey + cream + green-cypress)
- Desert-miniature (warm-sand + terra + cream + deep-shadow)
- Alpine-miniature (green + brown-wood + white-snow + blue-sky)
- Cottage-garden-miniature (wildflower-pastels + green + cream)
- Tropical-miniature (teal + coral + cream + palm-green)

━━━ RULES ━━━
- Miniature-warm palettes
- 3-5 specific color words per entry
- Cozy / warm dominant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
