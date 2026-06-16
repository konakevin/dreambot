#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/backyard_summer.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BACKYARD-SUMMER scene descriptions for RetroBot — the suburban backyard on a hot summer day, 1975-1995. No people visible. Pure scene/environment. Golden-hour and warm-afternoon light. The cookout just ended, the kids just ran inside — the place tells the story.

Each entry: 10-20 words. One specific backyard scene or detail. Focus on THE BACKYARD (the yard, patio, deck, fence) — not the street, not the wider neighborhood.

━━━ CATEGORIES ━━━
- Weber kettle grill smoking, charcoal-bag and lighter-fluid can beside it, tongs on the lid
- Picnic table with red-checkered cloth, paper plates, condiment caddy, watermelon halves
- Above-ground pool / kiddie pool, inflatable raft, pool noodles, aluminum ladder
- Lawn sprinkler arcing rainbow spray over wet grass, garden hose coiled
- Slip 'N Slide yellow plastic streak across the lawn, hose connection
- Webbed aluminum lawn chairs + cooler + transistor radio on the patio
- Lawn games — croquet wickets and mallets, lawn darts (jarts), horseshoe pit
- Hula hoops and a jump rope leaning on the chain-link fence
- Badminton net strung across the yard, shuttlecock in the grass
- Patio at dusk — citronella candle, tiki torch, bug-zapper glow
- Clothesline with sheets and wooden clothespins
- Vegetable garden, tomato cages, watering can, garden gnome
- Swing set / tire swing / treehouse with a rope ladder
- Fireflies rising at dusk, a mason jar with a punched lid on the steps
- Hand-crank ice-cream churn and a bag of rock salt on the picnic table
- Sandbox / wading toys / a Big Wheel parked on the patio

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 suburban America — period grill, toys, lawn gear (no modern equipment)
- Golden hour / warm hazy afternoon / dusk — long shadows, warm amber
- Warm analog film-grain feel
- Gender-neutral — boys and girls both lived this summer

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
