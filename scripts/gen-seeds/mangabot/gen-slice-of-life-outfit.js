#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SLICE-OF-LIFE OUTFIT entries — everyday casual clothing.

Each entry: 16-26 words. Outfit + material detail + lived-in quality.

VARIETY:
- 16% SCHOOL-UNIFORM (sailor seifuku / gakuran / blazer-style / sports-uniform / cram-school casual)
- 14% OFFICE-CASUAL (button-down + slacks / blouse + pencil-skirt / cardigan over dress-shirt)
- 14% CAFE-WORK (apron over t-shirt / waiter vest + button-down / barista bandana + tee)
- 12% HOMEWEAR (oversized sweater + leggings / hoodie + sweatpants / yukata-style robe / cardigan + jeans)
- 10% SEASONAL-CASUAL (light raincoat + boots / scarf + winter-coat / hoodie + denim / sundress + sandals)
- 8% TRADESPERSON (work-apron + jeans / coveralls / shop-coat / mechanic-jumpsuit)
- 8% TRAVEL-CASUAL (backpack + light-jacket + sneakers / commuter coat + dress-shoes / weekend-cardigan)
- 6% RETIREE (knit-cardigan + slacks / yukata at home / haori over kimono / gardening apron)
- 6% ATHLETIC (jogging-set / yoga-pants + tank-with-jacket / cycling-jersey-with-shorts-AND-windbreaker / surf-shirt-with-board-shorts)
- 6% ARTIST-CASUAL (paint-stained apron / illustrator hoodie + flannel / mangaka oversized tee + sweatpants)

DO write:
- Sailor seifuku navy pleated skirt with white blouse, loafers slightly scuffed, school-bag slung
- Button-down dress-shirt with loosened tie, dark slacks, dress-shoes worn at heel, briefcase grip
- Cafe apron over white t-shirt and jeans, bandana tied at brow, work-shoes
- Oversized cream sweater over leggings, fuzzy slippers, hair-tie at wrist
- Light teal raincoat over jeans, rubber boots, scarf tucked

DO NOT: "form-fitting" / "skin-tight" / "low-cut" / "exposed midriff" / "sultry" / photoreal fabric catalog / multiple outfits per entry.

Casual + lived-in + age-appropriate + fully covered.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
