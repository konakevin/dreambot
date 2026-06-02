#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} OCCULT-TOKYO OUTFIT entries — modern Japanese urban clothing with occult/supernatural touches. Tokyo-Ghoul / JJK / Bleach / Mob-Psycho register.

⚠️ ANTI-CHEESECAKE — every outfit fully covers chest, midriff, thighs. NO low-cut, NO crop-tops, NO bare-midriff, NO suggestive. COVERED.

Each 16-26 words. Outfit + material + occult-detail (talisman pinned / sigil-thread / cursed-tool holster / etc.)

VARIETY:
- 16% MODERN-EXORCIST GEAR (long black coat with red lining + ofuda strips at hem / dark jujutsu-style uniform with high collar / charcoal robe over jeans with prayer-beads belt)
- 14% URBAN-SCHOOL-UNIFORM-OCCULT (sailor seifuku with ofuda pinned at collar / gakuran with sigil-patch on sleeve / blazer with cursed-tool charm at lapel)
- 12% URBAN-MIKO-MODERN (modernized white kimono-top + red hakama under streetwear / miko-coat over jeans / black-and-white hybrid robe + sneakers)
- 10% SALARYMAN-CURSED (loose business-suit with ofuda peeking from inside-pocket / open dress-shirt with kanji-tattoo at collarbone / rolled-sleeve white-shirt with cursed-bandage on forearm)
- 10% CASUAL-HOODIE-OCCULT (oversized hoodie with kanji-sigil printed / black sweatshirt with paper-charm safety-pin / pullover with shimenawa-rope belt)
- 8% MONK-MODERN-FUSION (sohei warrior-monk gear with modern boots / saffron sash over dark long-coat / dark robe over t-shirt and cargo-pants)
- 8% LEATHER-COAT-HUNTER (black leather long-coat with talisman-buckle / dark trenchcoat with sigil-lining visible at collar / weathered black-coat with ofuda-strips inside)
- 6% YUKATA-HYBRID-OCCULT (light cotton yukata with cursed-thread embroidery / haori over jeans and tee / cropped-haori jacket with prayer-bead belt)
- 6% TATTOO-VISIBLE-CASUAL (turtleneck pulled to show kanji-sigil at neck / rolled-up dress-shirt with rune-tattoo on forearm / dark vest revealing shoulder-sigil)
- 6% TEMPLE-WORKER (apprentice priest robe with sneakers / cleaning-monk attire with talisman-pouch / shrine-maiden everyday attire)
- 4% CYBERPUNK-OCCULT (techwear with glowing kanji-stitching / utility-vest with sigil-printed underlayer / black urban-tactical with charm-pouches)

DO write:
- Long black coat with red interior lining and ofuda-strips pinned at hem, dark slacks, high boots
- Sailor seifuku navy-pleated skirt with ofuda paper-charm pinned at collar, knee-highs, dark loafers
- Modernized white kimono-top with red hakama under denim jacket, sneakers, prayer-beads at wrist
- Loose grey business-suit with ofuda paper-charm peeking from inside-jacket pocket, loosened tie, dress-shoes
- Black oversized hoodie with kanji-sigil printed across chest, dark jeans, sigil-thread bandana at wrist
- Sohei-style warrior-monk robe with modern combat-boots, saffron sash, talisman-belt with charms hanging

DO NOT: "low-cut" / "form-fitting" / "crop-top" / "bare midriff" / "thigh-high split" / sultry / cheesecake / multiple per entry.

Modern urban Japan + occult-thread. Always COVERED.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
