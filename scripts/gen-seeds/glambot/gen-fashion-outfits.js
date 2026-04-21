#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/fashion_outfits.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FASHION OUTFIT descriptions for GlamBot's fashion-moment path — sleek confident editorial outfits. Statement pieces.

Each entry: 15-30 words. One specific editorial outfit with details.

━━━ CATEGORIES ━━━
- Oversized blazer with nothing-underneath and statement trouser
- Sheer-gossamer slip with architectural sleeve-detail
- Power-shoulder suit in monochrome emerald
- Feather-trim coat over leather catsuit
- Floor-length sequin gown with thigh-slit
- Oversized puffer in metallic chrome
- Structural corset + wide-leg trouser
- Metallic jumpsuit with cape-shoulders
- Sheer mesh turtleneck layered under tailored blazer
- Leather trench + matching boots knee-high
- Silk slip dress draped architecturally
- Feather-epaulette blazer suit
- Ruched velvet gown with plunging neckline
- Mesh bodysuit under oversized denim
- Couture ball-skirt + cropped graphic tee (high-low)
- Wet-look vinyl pantsuit
- Cape-sleeve jumpsuit floor-length
- Sculptural origami top + pencil skirt
- Chain-mail metallic mini dress
- Oversized cape with stilettos
- Mesh bodysuit with embroidered appliqué
- Structured haute-couture gown (architectural shoulders)
- Tuxedo-jacket-as-dress belted
- Leather corset belt over silk-slip maxi
- Feather-epaulette midi with gold cuff
- Translucent raincoat over lingerie
- Oversized knit turtleneck + thigh-high boots
- Harness-detail bralette + wide trouser
- Sheer lace catsuit with embroidered accents
- Metallic pleated maxi skirt + crop top
- Denim-on-denim layered editorial
- Cape + shoulder-pads blazer-dress
- Sculptural feather-skirt with crop
- Sequin party-dress mini
- Velvet blazer-dress + ankle boots
- Leather trench wrapped tight
- Silk robe with beaded belt
- Embroidered cheongsam reimagined couture
- Fur-trim parka over silver-bodysuit
- Maxi pleated dress with metallic-sheen
- Architectural jumpsuit sculptured shoulders

━━━ RULES ━━━
- Editorial / statement-piece energy
- Couture-grade rendering
- Varied silhouettes, fabrics, cuts

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
