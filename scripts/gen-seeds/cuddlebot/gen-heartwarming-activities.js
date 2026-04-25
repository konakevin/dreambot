#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/heartwarming_activities.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} HEARTWARMING ACTIVITY descriptions for CuddleBot's heartwarming-scene path — specific heart-melting activities a cute creature could be doing. Described as activity + beat, species-agnostic.

Each entry: 10-20 words. One specific heart-melting activity beat.

━━━ CATEGORIES ━━━
- Tea / coffee (pouring tiny cup, holding mug with both paws, cheeks flushed from steam)
- Reading (snuggled with storybook, turning pages with paw, reading to stuffed toy)
- Baking (apron on, tiny rolling pin, flour on nose, cookies in oven)
- Eating treats (sharing cake, dangling spaghetti, nibbling strawberry, ice-cream face)
- Napping / sleeping (curled in blanket, drool-bubble, moon-dreams bubble)
- Stargazing (on hilltop with telescope, looking up wide-eyed, shooting star reaction)
- Cloud-watching (on back in grass, pointing at clouds)
- Gardening (with watering can, planting seeds, harvesting teeny tomatoes)
- Picnic in meadow (checked blanket, tiny sandwiches)
- Leaf-umbrella in rain (sheltering self or friend)
- Mushroom collecting (basket of tiny mushrooms)
- Riding on larger creature's back (wholesome companionship)
- Catching firefly in jar
- Balloon-holding (rising off ground slightly)
- Kite-flying on breezy day
- Ice-skating on pond (slipping comically)
- Snowball-making (tiny mittens)
- Roasting marshmallow (over tiny campfire)
- Playing music (tiny violin, ukulele, flute)
- Painting at easel
- Wrapping present with bow (can't reach)
- Blowing dandelion seeds
- Jumping in puddle (splash)
- Hot-chocolate with marshmallows
- Decorating tiny tree (holiday cozy)

━━━ RULES ━━━
- Activity type only — creature will be placed later
- Every beat is heart-melting / aww-triggering
- NO humans, NO dark elements, NO sharp-edge

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
