#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_dish_being_prepared.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} KAWAII DISHES being prepared in a mini-chef kitchen scene. Each entry describes the SPECIFIC dish/treat the chef-foods are currently making — visible in the scene as a centerpiece.

Each entry: 14-26 words. ONE specific kawaii dish in mid-preparation. Magical/oversized scale, painterly Pop-Mart kawaii register.

DO write:
- A giant pastel-rainbow tiered birthday cake half-frosted with kawaii face on the side
- A wooden board of fresh sushi-rolls in vibrant pastel rice + nori
- A tray of just-rolled pastel macarons in cream and pink with smiling faces
- A giant ramen bowl with floating soft-boiled egg + swirling pastel broth
- A row of decorated kawaii cupcakes with star and heart toppers
- A wooden tray of pastel-rainbow mochi-balls with smiling faces
- A giant kawaii pizza with star-shaped pepperoni and heart-shaped cheese
- A tiered tower of warm croissants with golden butter-glaze
- A magical pastel taiyaki fish-pastry filling the wooden plate
- A wooden cutting-board with pastel onigiri rice-balls in row
- A giant boba-tea drink in pastel-rainbow with kawaii face on the cup
- A pan of bubbling shaved-ice kakigori with pastel syrup drizzles
- A wooden ramen-pull-noodle station with kawaii steaming bowls
- A tray of frosted donuts with rainbow-sprinkles being decorated
- A wooden dim-sum platter with bamboo steamer of pastel dumplings
- A giant kawaii pretzel being twisted with butter-glaze
- A pastel layer-cake mid-decoration with frosting flowers being piped on
- A wooden honey-comb tray dripping pastel honey into a bowl
- A giant kawaii sundae glass with pastel scoops + cherry-on-top being assembled
- A wooden board of just-baked kawaii cookies with smiling faces

DO NOT write:
- Modern fast-food / commercial-frozen dishes
- Photoreal / non-kawaii dishes — Pop-Mart kawaii painterly register
- Foreground characters / chef-foods (those are in food_inhabitants axis)
- The kitchen BACKDROP / counter (that's in other axes)
- Real kanji / Japanese-text — keep all labels as decorative-pattern

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
