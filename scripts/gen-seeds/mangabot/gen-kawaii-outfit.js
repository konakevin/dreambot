#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII OUTFIT entries. Frilly/cute silhouettes — sanrio / lolita / cafe-uniform / school-uniform-with-charms / yukata-festival. ALWAYS INNOCENT-CUTE, NEVER cheesecake.

Each entry: 18-28 words. Outfit + cute-detail + accent + pastel-palette + soft-fabric.

VARIETY:
- 16% LOLITA-FRILLY (sweet-lolita / gothic-lolita / classic-lolita / hime-lolita)
- 14% SCHOOL-UNIFORM WITH CHARMS (sailor seifuku + heart-charm pin + lace-trim sock)
- 12% MAID-CAFE (frilly apron + headpiece + skirt + thigh-high socks)
- 10% YUKATA-FESTIVAL (yukata + obi + geta + festival hair-flower)
- 10% PASTEL-CASUAL (oversized pastel sweater + skirt + ankle-socks + headband)
- 8% IDOL-STAGE-CUTE (frilly idol dress + glittering boots + ribbon)
- 8% MASCOT-SUIT (cute mascot costume / bear-ears hoodie / bunny-suit casual)
- 6% SANRIO-COSPLAY (Hello-Kitty pajamas / Pompompurin-coded outfit / cinnamoroll-coded sweater)
- 6% PARTY-COSPLAY (princess-dress / fairy-dress / unicorn-onesie / themed-party costume)
- 6% UNIFORM-CUTE-ACCENT (any uniform with cute add-on charms / pins / patches)
- 4% DESSERT-THEMED (strawberry-themed dress / parfait-print top / cake-detail accessories)

DO write:
- Sweet-lolita full-skirt pastel-pink dress with white lace petticoat, satin bow at waist, frilled cuffs, thigh-high white socks with mary-jane shoes
- Sailor seifuku navy-pleated skirt with heart-charm hair-clip, pastel-pink scarf, white knee-highs, polished brown loafers
- Frilly maid-cafe apron over black mini-dress with white-lace trim, headpiece, ribbon-tied sleeves, white thigh-high socks
- Pastel-pink yukata with goldfish-print pattern, white obi, geta sandals, hair-flower of forget-me-not
- Oversized pastel-mint sweater with strawberry-print, mini-skirt, knee-high knit socks, headband with bow

DO NOT: "form-fitting" / "skin-tight" / "minimal coverage" / "exposed cleavage" / "low-cut" / "sultry" / "deep-V". Photoreal fabric. Multiple outfits per entry.

Outfit reads FRILLY-CUTE + age-appropriate + fully covered.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
