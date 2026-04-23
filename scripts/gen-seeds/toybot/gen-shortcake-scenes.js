#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/shortcake_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} STRAWBERRY-SHORTCAKE-era-toy scene descriptions for ToyBot's shortcake-scene path — 1980s OG girl-targeted scented-doll figurines (Strawberry Shortcake / Rainbow Brite / My-Little-Pony / Popples / Rose-Petal-Place / Lady-Lovely-Locks DNA). Soft-plastic dolls with oversized heads, rosy-cheeks, pastel-yarn hair, dessert/flower-themed wardrobe, photographed in hand-built dessert-fantasy playsets.

Each entry: 18-28 words. ONE specific 80s-toy-catalog scene with scented-doll figurines mid-activity in a pastel dessert-or-flower-themed miniature world.

━━━ THE CHARACTERS ━━━
Classic 1980s girl-targeted soft-plastic dolls — oversized heads with huge round eyes, tiny nose, rosy blush, thick yarn-or-rooted pastel hair (strawberry-blonde / raspberry-pink / blueberry-blue / lemon-yellow / mint-green), gingham-or-calico dresses, apron skirts, pantaloons, pinafores, giant bonnets or berry-themed hats, striped tights, ankle-boots. 3–5 inch scented-doll scale. Multiple character-dolls per scene is fine.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Berry-patch picnic — pastel dolls on gingham blanket among oversized strawberries
- Cupcake-cottage kitchen — doll stirring frosting in giant mixing-bowl, icing-bag on counter
- Rainbow-bridge crossing — scented dolls walking with tiny pastel pony over stripe-arched bridge
- Pie-baking contest booth — dolls holding steaming pies on lace tablecloths at country fair
- Lollipop-forest path — dolls skipping under oversized swirled lollipop-trees
- Ice-cream-parlor counter — dolls on stools with pastel sundaes, cherries on whipped cream
- Flower-garden tea-party — dolls in oversized petal-chairs sipping from rosebud cups
- Cotton-candy carnival — dolls holding giant pink-and-blue cotton-candy cones, ferris-wheel
- Cupcake-topped castle tower — doll princess waving from frosting-turret, candy-path below
- Sleepover in a cupcake-liner bed — dolls in matching pajamas, pillow-fight mid-pose
- Gingerbread-cottage doorway — dolls holding candy-canes, icing-trim roof dripping
- Pastel-meadow rainbow — dolls holding hands spinning in circle under stripe rainbow
- Pony-pulled cloud-carriage ride — scented dolls waving from fluffy cloud-chariot
- Candy-shop counter — dolls behind jars of gumdrops with scoop, penny-candy display
- Heart-shaped hot-air-balloon basket — dolls waving down, pastel ribbons trailing
- Doll-sized ice-skating pond — dolls mid-glide with scarves flying, frosted-tree backdrop
- Pink-tulip field — dolls gathering tulips in wicker baskets, bow-tied apron strings
- Cake-slice bedroom — doll brushing yarn-hair at heart-shaped mirror, cupcake lamp
- Dessert-train caboose — dolls leaning out sugar-trimmed windows, steam-puff clouds
- Strawberry-patch harvest — dolls climbing ladders to oversized berries, full baskets at foot
- Pastel-clouds tree-house — dolls peeking from rainbow-ladder treehouse, kite tail trailing
- Candy-stripe bakery storefront — dolls arranging cupcake-tower in window, awning overhead
- Teddy-bear picnic — dolls and oversized teddy-figurines sharing mini-cakes on quilted blanket
- Hot-cocoa fireside — dolls in matching nightcaps with mugs topped by marshmallow-mounds
- Pastel-unicorn meadow — dolls braiding yarn-mane of tiny pink unicorn, flower-crown nearby

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference DOLL / figurine / soft-plastic / rooted-hair / playset-miniature LANGUAGE
- Pastel + dessert + flower + rainbow aesthetic — saturated candy palette
- Oversized-scale props (giant strawberry, cupcake castle, lollipop tree) — classic 80s toy scale-play
- Warm nostalgic lighting — golden-hour / lamp-glow / faded-catalog palette
- Wholesome cozy activity — no edge, no irony

━━━ BANNED ━━━
- NO "real woman" / "real girl" — these are DOLLS
- NO real brand names (Strawberry Shortcake / Rainbow Brite / Sweetie Belle) — archetype only
- NO modern / edgy / ironic tone — this is wholesome 80s-catalog
- NO horror / creepy / dark
- NO sexual / mature content

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
