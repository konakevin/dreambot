#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for CuddleBot — warm cozy storybook palettes. Always wholesome + soft + cute. Sanrio-pastel + storybook-warm + cozy-autumn.

Each entry: 10-20 words. One specific warm-cozy palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Warm pastels (peach + cream + soft pink + mint + buttercream)
- Cozy autumn (rust + honey + pumpkin + cream + warm brown)
- Dreamy pinks (blush + cotton-candy + rose + peach + cream)
- Sanrio-pastels (mint + pastel-yellow + baby-pink + lavender + cream)
- Storybook-warm (amber + honey + cream + warm-beige + soft-brown)
- Marshmallow palette (cream + baby-pink + white + pale-cream)
- Cloud-pastel (baby-blue + lavender + peach + pearl-white)
- Honey-cozy (warm-honey + cream + amber + butter + caramel)
- Tea-party pastel (mint + rose + lemon + cream)
- Lavender-evening (lavender + dusty-rose + peach + cream-blue)
- Strawberry-fields (strawberry-red + cream + pink + soft-green)
- Mushroom-forest cute (mint-green + rust + honey + peach + cream)
- Bakery-warm (cream + caramel + powder-sugar-white + honey + raspberry-pink)
- Ice-cream-stand (mint + strawberry + vanilla + chocolate-cream + pastel-pink)
- Nursery-gentle (cream + baby-blue + butter-yellow + gentle-pink)
- Holiday-cozy (pine-green + cream + gold + soft-red-muted)
- Spring-bloom-soft (pale-sakura + mint + honey + cream)
- Tropical-gentle (coral + mint + cream + butter + soft-teal)

━━━ RULES ━━━
- All palettes wholesome + soft + warm
- 3-5 specific color words per entry
- Never sharp-contrast or dark-dominant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
