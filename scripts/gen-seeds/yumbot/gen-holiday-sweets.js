#!/usr/bin/env node
// YumBot Stage P2 (SHADOW) — holiday-sweets. Kawaii holiday treats with cute
// faces: Christmas cookies, gingerbread, Halloween candy, Easter treats,
// Valentine chocolates, etc. SCENE = the festive treat setup; SWEETS =
// individual kawaii holiday treats with faces. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_holiday_sweets_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} KAWAII HOLIDAY-SWEETS SCENES for YumBot. Each entry sets a festive HOLIDAY treat context where 1-3 kawaii holiday sweets (with smiling faces baked in) are the stars. Each entry 20-32 words. Describe the festive SETTING + the sweets' arrangement (individual sweets supplied separately).

━━━ HOLIDAY CONTEXTS (spread across all ${n}) ━━━
- Christmas cookie platter (frosted sugar cookies, a red-and-white plate, pine sprigs, a mug of cocoa, twinkling lights)
- Gingerbread scene (a little gingerbread house, gumdrop trim, icing snow, candy-cane fence, a snowy board)
- Halloween candy spread (candy corn, wrapped chocolates, a carved-pumpkin bowl, cobweb lace, cozy orange glow)
- Easter treat basket (pastel chocolate eggs, a woven basket, spring flowers, a bunny-shaped cookie, soft daylight)
- Valentine chocolate box (a heart-shaped box of chocolates, red ribbon, rose petals, a doily, warm blush light)
- Lunar New Year sweets tray (a red lacquer tray of festival candies, gold accents, a tangerine, a paper-lantern hint)
- Thanksgiving pie corner (a mini pumpkin pie, autumn leaves, a whipped-cream dollop, acorns, a plaid napkin)
- Birthday-cake celebration (a frosted cake with candles, confetti, party streamers, a slice on a plate)
- Winter hot-cocoa-and-cookies night (a plate of cookies for Santa, a glass of milk, a stocking, firelight)
- Spring flower-cake tea (a floral-iced petit-four, a teacup, cherry blossoms, a lace doily, pastel light)
- Autumn candy-apple stall (caramel and candy apples on sticks, fallen leaves, a wooden crate, golden light)
- Festive donut-and-sprinkles tray (holiday-sprinkled donuts, a tiered stand, garland, warm bakery glow)

━━━ THE KAWAII IDENTITY ━━━
Every sweet has a CUTE SMILING FACE baked into it (dot eyes, rosy cheeks, tiny smile) — the treats are adorable food-characters. The festive holiday theme reads instantly. Cozy, sweet, jewel-bright or pastel. NO people anywhere — the sweets are the only characters.

━━━ RULES ━━━
NO humans (the sweets are the characters). NO readable text (decorative marks only). NO photoreal / gritty register. Keep each entry a distinct holiday context + a specific cute detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_holiday_sweets_treats.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} individual KAWAII HOLIDAY-SWEET snippets for YumBot's holiday-sweets path — single adorable holiday treats with cute faces. Each 10-18 words. START WITH THE SWEET + its cute face + a festive detail.

━━━ SWEET TYPES (spread across all ${n}) ━━━
- a gingerbread man with rosy cheeks, icing-button smile, and a candy-cane scarf
- a candy cane with a cheerful face and a tiny bow
- a frosted snowman cookie with a shy smile and a knitted-icing hat
- a jack-o'-lantern cookie with a friendly grin instead of a spooky one
- a candy-corn character with a sweet little face
- a pastel chocolate Easter egg with a bashful face and a ribbon
- a heart chocolate with a blushing smile and a tiny arrow
- a Santa-hat cupcake with a jolly face and a cream pom-pom
- a pumpkin pie slice with a cozy sleepy smile and a cream cloud
- a sugar-cookie star with a twinkly happy face
- a marshmallow snowman with dot eyes and mitten arms
- a candy-apple with a glossy grin and a leaf tuft
- a festive donut with sprinkle freckles and a delighted face
- a mochi bunny sweet with a soft content smile and pink ears

━━━ RULES ━━━
Each is ONE cute holiday-sweet-character with a face. Kawaii, festive, adorable (friendly, never scary). NO humans. NO text. Keep each a distinct sweet + face + festive detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
