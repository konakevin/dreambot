#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_food_world.json',
  total: 200,
  append: true,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (n) => `You are writing ${n} TINY-FOOD-WORLD scene descriptions for TinyBot — edible dioramas where REAL food becomes architecture and landscape at miniature scale. The food MUST READ AS REAL FOOD first, miniature world second. Studio Ghibli food-magic crossed with Great-British-Bake-Off + miniature wonder.

Each entry: 18-28 words. ONE specific food-as-landscape scene with food-architecture detail.

━━━ FOOD-AS-LANDSCAPE TYPES (mix broadly across all entries) ━━━
- Sushi as island archipelago (nigiri-islands in soy-sauce sea, wasabi-mountains, ginger-pink-shore)
- Cake as hilltop village (frosted-dome rooftops, sprinkle paths, marzipan trees, ganache-river)
- Cookies as marketplace (cookie-cobblestone plaza, gingerbread-stalls, icing-banners, cinnamon-stick pillars)
- Bread loaf as cliff city (crusty bread-loaf cliffs, sesame-seed gravel paths, butter-lake at the base)
- Donut as ringed-fortress (sprinkled-glaze ramparts, hole-in-the-middle inner courtyard, jam-moat)
- Fondant fairyland (rolled-fondant hills, gum-paste flowers, sugar-glass ponds, royal-icing snowdrifts)
- Macaron staircase tower (stacked pastel macarons as a spiraling tower, buttercream cascades)
- Croissant rooftop village (flaky-crescent rooftops, butter-glaze gleam, apricot-jam chimneys)
- Pancake-stack ziggurat (syrup-cascading layered pancakes, butter-pat snowcap, blueberry-boulders)
- Sushi-roll bridge city (maki-roll towers connected by chopstick bridges, soy-sauce canals)
- Dim-sum harbor (steamer-baskets as docks, dumpling-boats, chopstick-piers, soy-sauce sea)
- Pizza-slice mountain (cheese-pull canyons, pepperoni-mesas, basil-forests, crust-cliffs)
- Cupcake village (frosted-cupcake cottages with sprinkle roofs, paper-liner walls, cherry-chimney)
- Marshmallow snowdrift town (puffy white drifts as cottages, candy-cane streetlamps)
- Berry orchard village (giant raspberries as trees, blueberry-boulders, mint-leaf shutters)
- Chocolate-fountain falls (cascading molten chocolate cliffs, white-chocolate boulders, caramel-pools)
- Ice-cream-sundae mountain (scoop-summits, hot-fudge-river, sprinkle-meadows, cherry-peak)
- Ramen-bowl village (broth-lake harbor with chopstick-bridges, narutomaki-island, scallion-forests)
- Tea-and-biscuit landscape (steam-mist over a teacup-lake, biscuit-cliffs, jam-shore)
- Birthday-cake castle (multi-tier cake as castle, candle-towers, frosting-flag-banners)

━━━ TEXTURE OBSESSION (every entry must include FOOD TEXTURE detail) ━━━
- Glossy frosting domes, crusty bread cliffs, sugar-glass tide pools
- Marshmallow snowdrifts, gummy-bear inhabitants peeking out
- Sprinkle paths, fondant rooftops, cookie cobblestones
- Raspberry-orchard trees, whipped-cream clouds
- Drizzled-syrup rivers, butter-pat lily-pads
- Caramelized-sugar windows, candy-cane streetlamps

━━━ INHABITANTS (OPTIONAL — peripheral only) ━━━
- Gummy-bear villagers, marzipan figurines, fondant figurines
- Cookie-people / gingerbread-people in tiny dough costumes
- NEVER identifiable real humans
- Cap on figurines: 0-3 per scene, peripheral only

━━━ LIGHTING / FOOD-PHOTOGRAPHY DNA ━━━
- Warm bakery-window glow OR crisp food-photography clarity
- Steam, condensation, glaze-shine, syrup-gleam
- Dessert-shop honey-glow OR sushi-counter bright-clean
- Tilt-shift shallow DOF makes the food feel like distant landscape, then resolves into edible architecture on close inspection

━━━ ABSOLUTELY BANNED ━━━
- NO inedible / fake-looking food (it must look REAL — appetizing, not plastic)
- NO identifiable humans
- NO sexual/suggestive food (no innuendo)
- NO rotting / moldy / decaying food
- NO IP brands (no McDonald's, no Coca-Cola)
- NO grim / horror food

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: food-base + scene-type + texture-detail. "Cake village with frosting roofs" and "frosted cake-cottage village" are TOO SIMILAR. Vary the FOOD + the SCENE + the TIME-OF-DAY across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Sushi-archipelago at golden hour, nigiri-islands in a soy-sauce sea, wasabi-volcano in distance, ginger-pink-shore beaches, chopstick-bridges connecting tuna-cliffs"
- "Cupcake village at dusk with frosted-cherry-roof cottages, sprinkle-cobblestone paths, paper-liner walls, marshmallow-cloud sky, gummy-bear villagers peeking from doorways"
- "Croissant rooftop town in golden bakery-window light, flaky-crescent shingles, butter-glaze gleam, apricot-jam chimney smoke, sesame-poppy-seed cobblestones"
- "Birthday-cake castle on a buttercream-cliff, candle-towers lit, frosting-flag-banners, marzipan-rose-gardens, ganache-moat below the drawbridge of fondant-planks"
- "Ramen-bowl harbor at noon, broth-lake with chopstick-bridges, narutomaki-spiral-island, scallion-forest hills, soft-egg-cottage with steam rising from the chimney"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
