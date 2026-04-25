#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/miniature_feast_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} MINIATURE FEAST SCENE descriptions for CuddleBot's miniature-feast path — tiny food and cooking scenarios. Species-agnostic (creature placed later).

Each entry: 15-25 words. One specific food/cooking/feast scenario at miniature scale.

━━━ CATEGORIES ━━━
- Tiny bakery (rolling dough on tiny counter, flour clouds, oven glowing warm)
- Tea party (oversized teacup, tiny sandwiches on tiered stand, sugar cubes as stools)
- Pancake stack (climbing stack of pancakes taller than self, butter-and-syrup waterfall)
- Cookie decorating (piping bag bigger than self, sprinkles everywhere, tongue out concentrating)
- Strawberry feast (sitting on giant strawberry, nibbling with both paws)
- Ramen bowl (sitting on edge of giant ramen bowl, chopsticks across lap)
- Pizza slice surfing (riding a slice like a boat, cheese stretching)
- Ice cream mountain (scoops piled impossibly high, dripping down cone)
- Spaghetti sharing (Lady-and-the-Tramp noodle moment)
- Cupcake decorating (standing on frosting, placing cherry on top)
- Hot chocolate mug (sitting in/on rim of giant mug, marshmallow raft)
- Honey jar (dipping tiny spoon in honey pot, golden drips)
- Fruit salad bath (swimming in giant fruit bowl among berries)
- Donut hole home (peeking through donut hole, sprinkles as confetti)
- Bread-baking (kneading tiny loaf, warm oven glow behind)
- Candy shop counter (surrounded by jars of colorful sweets)
- Waffle grid maze (walking through waffle squares like rooms)
- Soup pot stirring (standing on pot rim, oversized wooden spoon)
- Chocolate fountain (tiny creature at base, catching drops)
- Picnic basket unpacking (pulling out oversized sandwich from wicker basket)

━━━ RULES ━━━
- Food is OVERSIZED relative to creature OR creature is tiny in normal kitchen
- Every scene has warm bakery/kitchen glow energy
- Food details are charming and appetizing (not gross or messy-gross)
- Describe the food/cooking scenario, not the creature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
