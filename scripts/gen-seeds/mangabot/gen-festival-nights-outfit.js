#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} FESTIVAL-NIGHTS OUTFIT entries — Japanese summer matsuri attire. YUKATA or JINBEI ONLY (no modern clothes). ALWAYS modest + properly worn. Each 16-26 words.

Format: Yukata/jinbei + obi/sash + footwear + matsuri accent.

VARIETY:
- 28% FEMALE-YUKATA (cotton yukata in floral / fireworks / asagao morning-glory / kingyo goldfish / blue-wave seigaiha pattern, with broad obi, geta sandals)
- 18% MALE-JINBEI (cotton jinbei top-and-shorts set in indigo / navy / charcoal / pale-blue, with kaku-obi or tied-cord, geta)
- 12% MALE-YUKATA (dark indigo or charcoal yukata with kaku-obi narrow-sash, geta sandals, paper-fan tucked at obi)
- 10% FEMALE-YUKATA-PASTEL (pastel-pink / sky-blue / mint cotton yukata with white obi and floral hair-pin)
- 8% MIKO-SHRINE-MAIDEN (white kosode + red hakama-skirt, white tabi-socks, zori-sandals)
- 8% HAPPI-COAT (festival happi-coat over t-shirt + shorts or trousers, hachimaki headband, modest-worn)
- 6% CHILD-YUKATA (kid-sized cotton yukata with bright print, soft obi tied bow, small geta)
- 6% MATSURI-WORKER (vendor in indigo jinbei with apron tied / shrine-helper in haori + hakama)
- 4% FORMAL-YUKATA (elder in muted-grey or navy formal yukata, properly worn with full obi)

DO write:
- Indigo cotton yukata with white asagao morning-glory print, wide red obi tied at back, white geta sandals, hair-flower pin
- Navy jinbei top and matching shorts set, narrow cord-tie at waist, simple geta sandals, paper-uchiwa fan tucked at sash
- Charcoal male yukata with subtle wave-print, narrow kaku-obi sash at waist, wooden geta, folding-fan at obi
- Pastel-pink cotton yukata with white peony-print, wide white obi with bow at back, geta sandals, kanzashi flower-comb
- Miko shrine-maiden white kosode top with red hakama-skirt, white tabi socks, woven zori sandals, white hair-ribbon
- Festival happi-coat in indigo with white kanji over plain t-shirt and dark trousers, white hachimaki headband
- Child-size yukata in bright sakura-print with soft yellow obi tied in butterfly-bow, tiny geta, small drawstring-pouch

DO NOT: "yukata slipping off shoulder" / "obi loose" / "untied" / "low-cut" / "exposed shoulder" / "wet-clinging" / "see-through" / modern street-wear / multiple outfits per entry. Properly worn, fully closed, modest.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
