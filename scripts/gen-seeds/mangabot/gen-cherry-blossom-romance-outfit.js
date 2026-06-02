#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROMANCE-OUTFIT entries — tender date/school/spring casual clothing. Cherry-blossom mood. ALWAYS modest + tender.

Each 16-26 words. Outfit + material detail + spring-romantic accent.

VARIETY:
- 18% SAILOR-FUKU/GAKUAN (school uniform with pink-bow / soft cardigan over uniform)
- 14% SPRING-SUNDRESS (light cotton dress with floral-print / pastel midi-dress)
- 14% SCHOOL-CASUAL (white button-down + skirt or slacks / loose cardigan + chinos)
- 12% YUKATA-FESTIVAL (pink/cherry yukata + obi + geta / soft-pastel yukata)
- 10% SCHOOL-UNIFORM-MALE (gakuran with loose tie / blazer + slacks / sailor-style male uniform)
- 10% CASUAL-ROMANTIC (oversized pastel sweater + jeans / chunky-knit cardigan + skirt)
- 8% TRAVELER-SPRING (light jacket + scarf + sneakers / spring trench + backpack)
- 8% PERFORMER-DRESSY (concert outfit / recital dress / button-down + slacks for date)
- 6% RAIN-ROMANTIC (light raincoat + boots / umbrella-held attire)

DO write:
- Sailor seifuku navy-pleated skirt with white blouse and pink-bow at chest, knee-highs, scuffed loafers
- Spring sundress in pastel-pink with white cardigan over shoulder, sandals, ankle-bracelet charm
- White button-down with loose tie and grey slacks, dress-shoes worn, letter-in-pocket
- Pastel yukata with cherry-blossom print, white obi, geta sandals, hair-flower behind ear
- Soft cream cardigan over white blouse and knee-length skirt, mary-jane shoes

DO NOT: "form-fitting" / "low-cut" / "sultry" / "low-cut" / photoreal-catalog / multiple outfits per entry.

Modest + tender + age-appropriate.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
