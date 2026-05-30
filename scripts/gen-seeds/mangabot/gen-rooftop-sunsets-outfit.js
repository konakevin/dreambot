#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_outfit.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROOFTOP-OUTFIT entries — casual evening/after-work clothing for character on rooftop at sunset.

Each 16-26 words. Outfit + material + lived-in detail.

VARIETY:
- 16% SCHOOL-UNIFORM-LOOSE (sailor seifuku with cardigan tossed on / gakuran tied at waist / blazer over shoulder)
- 14% OFFICE-CASUAL (button-down with loose tie / cardigan over dress-shirt / blouse with rolled sleeves)
- 12% CHEF-APRON (chef-apron over t-shirt / kitchen-coat / sushi-cook white-coat)
- 10% CASUAL-EVENING (oversized cardigan + jeans / hoodie + sweatpants / loose-tee + shorts)
- 10% ARTIST-WORK (paint-stained apron / photographer-vest / sketcher hoodie + jeans)
- 8% MUSICIAN (band-tee + jeans / casual stage-outfit / guitar-strap over plain top)
- 8% PARTY (casual party-dress / button-down + slacks / loose blazer)
- 6% YOGA/ATHLETIC (jogging-set / yoga top + leggings WITH light cardigan / cycling-jersey + shorts)
- 6% YUKATA-EVENING (light cotton yukata / kimono-style robe / haori over t-shirt)
- 6% RAIN-EVENING (light raincoat + boots / sweater + scarf / windbreaker)
- 4% WORK-FORMAL (loose-tied suit / blazer with rolled sleeves)

DO write:
- Sailor seifuku navy-pleated skirt with cream cardigan tossed over shoulder, knee-highs, loafers
- Button-down white shirt with loosened black tie, dark slacks, dress-shoes worn at heel
- Chef-apron over plain white t-shirt with jeans, bandana at brow, kitchen-shoes
- Oversized cream cardigan over jeans, sneakers, hair-tie at wrist
- Yukata in indigo with white obi, geta sandals, light fan tucked in obi

DO NOT: "form-fitting" / "low-cut" / "sultry" / multiple per entry.

Casual + lived-in.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
