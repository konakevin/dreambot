#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_archetype.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII ARCHETYPE entries — cute anime girl identity types. Sanrio / lolita / character-cafe / K-On / Lucky-Star / Sailor-Moon-coquette tradition.

Each entry: 12-22 words. Archetype + cute domain + tone.

VARIETY:
- 18% SANRIO-CODED (Hello-Kitty-coded server / My-Melody-style baker / Cinnamoroll-mood barista / Kuromi-edgy-cute / Pompompurin-coded chef)
- 16% LOLITA/FRILLY (sweet-lolita with bunny-ears / gothic-lolita with parasol / classic-lolita with tea-set / hime-lolita with crown)
- 14% SCHOOL-CUTE (cute schoolgirl with charm-stickers / class-rep with notebooks / kendo-club-cute / library-bookworm with glasses)
- 12% CAFE-COSTUME (maid-cafe server / cat-cafe assistant / themed-cafe waitress / dessert-shop-girl)
- 10% IDOL-CUTE (cute idol mid-pose / pop-singer-coquette / mascot-suit performer)
- 8% PLUSHIE-LOVER (girl hugging giant plushie / surrounded by plushies / shopping-for-plushies)
- 6% FESTIVAL-CUTE (yukata-festival-girl with goldfish-bag / matsuri-girl with takoyaki / hanabi-festival girl)
- 6% DESSERT-LOVER (parfait-lover / pancake-stack-eater / boba-tea sipper / cake-decorator)
- 6% MASCOT-COMPANION (girl with cat-companion / dog-companion / bunny-companion / capybara-companion)
- 4% MAGICAL-GIRL-LITE (off-duty magical-girl in regular outfit / between-transformation-girl / mascot-pet-as-companion)

DO write:
- Hello-Kitty-coded cafe-server with apron-bow and bell-charm at wrist, cheerful register
- Sweet-lolita with bunny-ears headband and frilly pastel umbrella, coquette tone
- Cute schoolgirl with hot-pink charm-stickers on lunch-box, mid-laugh
- Maid-cafe server with frilly apron and twin-bell hair-clips, mid-blush
- Yukata-festival girl with goldfish-bag and pink hair-flower, gentle wonder

DO NOT: copyrighted character names (Hatsune-Miku / Sakura-cardcaptor — describe archetype) / multiple per entry / non-cute roles.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
