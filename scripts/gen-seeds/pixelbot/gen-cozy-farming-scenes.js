#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_farming_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} COZY FARMING / LIFE-SIM EXTERIOR-VISTA scene descriptions for PixelBot's cozy-farming-life-sim path. Genre lineage: Stardew Valley + Spiritfarer pixel-tribute + Animal Crossing pixel-spinoff + Story of Seasons + Harvest Moon + Ooblets pixel.

Each entry: 30-50 words, ONE paragraph, focused on a WIDE COZY FARMSTEAD EXTERIOR vista — pixel farm with crops in neat rows, henhouse exterior with chickens scratching, beachside fish-shack with smoke curling, summer-festival town square, autumn-harvest barn (exterior), market vegetable-stall with vendor.

━━━ THE NORTH STAR ━━━

Every scene should feel like "a screenshot from a cozy pixel-farming-sim I want to play for 200 hours." WIDE FARMSTEAD EXTERIOR composition with crops + animals + structures visible. NEVER an indoor closeup, NEVER a still-life product shot, NEVER a closeup of hands holding an object.

━━━ MANDATORY ELEMENTS (every entry) ━━━

1. EXTERIOR FARMSTEAD VISTA — wide composition showing a farm / village / outdoor scene with multiple visible elements
2. CROPS / ANIMALS / FARMSTEAD STRUCTURES visible (crops in rows, fields, henhouse, barn, fishing pier, market stall, orchard, animal pasture)
3. NPC FARMER / VILLAGER mid-action somewhere in the scene (mid-stride, tending crops, hauling, fishing, vending)
4. PIXEL ANIMALS visible (chickens / pixel-cats / dogs / sheep / cows / ducks / horses)
5. WARM ATMOSPHERIC PARTICLES (drifting cherry-petals / autumn-leaves / pollen / chimney smoke / butterflies / drifting laundry)

━━━ EXTERIOR-ONLY SETTING TYPES — ROTATE BROADLY (NEVER indoor) ━━━

- Pixel-farm at golden hour with crop-rows and scarecrow
- Henhouse exterior with chickens scratching, lit door
- Beachside fish-shack EXTERIOR with smoke from chimney, nets hanging outside, gulls
- Summer-festival town square with hanging lanterns, food carts, NPCs in motion
- Autumn-harvest barn EXTERIOR with pumpkins stacked outside, hay-bales, distant scarecrow in field
- Riverside fishing-pier at dawn with single fisher-NPC, mist on water, lit lantern, ducks
- Forest-mushroom-foraging clearing with NPC kneeling at glowing mushrooms, sunbeam through canopy
- Garden-flowerbed at dawn (exterior, wide) with bees, butterflies, watering-can, NPC tending blooms
- Beekeeper-cottage EXTERIOR with hives in foreground, pixel-bees drifting, smoker-puff, cottage-flowers
- Orchard at autumn with apple-trees, fallen apples, pixel-cat in tree
- Outdoor vegetable-stall at market with fresh produce in baskets, awning, NPC vendor, customers
- Lakeside dock EXTERIOR with rowboat, lit lantern, NPC fishing, mist, dragonfly drift
- Animal-pasture with sheep grazing, single pixel-dog herding, golden hour, distant farmhouse
- Spring cherry-blossom park with petals drifting, NPCs picnicking on blanket, river running through
- Rooftop-vegetable-garden EXTERIOR with planters, hanging tools, sunset light
- Wheat-field harvest with NPC swinging scythe, hay-bales, distant farmhouse
- Cow-pasture at dawn with mist rising, three cows mid-graze, milking-stool, lit barn-door
- Riverside-mill exterior with water-wheel turning, lit interior glow, NPC hauling sack
- Town-bridge over stream with cottage-cluster on the far bank, NPC walking
- Greenhouse EXTERIOR (looking at the greenhouse from outside) with sprouts visible through glass
- Apiary in flower-meadow with multiple hives, NPC beekeeper, drifting pollen
- Garden-trellis with climbing vines, ripe gourds, vegetable-bed, NPC harvesting
- Spring rice-paddy with terraces, distant farmer-NPC bent over crops, water-reflections
- Fishing-cove with multiple boats moored, NPC sorting catch on the dock, gulls
- Outdoor smokehouse with smoke-trails, hanging fish, NPC tending the fire
- Pumpkin-patch at autumn with rows of pumpkins, NPC with cart, scarecrow
- Lavender-field rolling hills with sunset, NPC harvesting bundles, drifting pollen
- Outdoor cheese-cellar entrance with wooden barrels, NPC rolling barrel, vine-covered stone wall
- Hop-yard with vines on tall poles, NPC checking the harvest, drifting pollen
- Mushroom-cellar entrance dug into hillside, NPC carrying basket, glowing mushroom-cluster outside

━━━ HARD RULES ━━━

- ALWAYS EXTERIOR composition (NEVER indoor / kitchen / interior closeup / hands-holding-object / still-life-product-shot)
- ALWAYS WIDE composition with multiple visible elements (NEVER close-up macro shot)
- WARM SOFT LIGHTING — golden hour, sunrise, sunset
- ANIMATED-FEEL DETAIL — drifting petals, crops swaying, chimney smoke, animals mid-stride
- INHABITED — NPCs going about their day, animals visible
- LAYERED PARALLAX DEPTH — foreground + middle + far horizon
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth
- NEVER named IPs (Stardew, Animal Crossing, Harvest Moon by name)
- NEVER UI / HUD / menus / inventory icons / energy bars
- NEVER closeup hand / closeup object / still-life product shot
- NEVER indoor scene (kitchen, tea-cafe, bakery, greenhouse interior, henhouse interior, hot-spring bath, candling-station)

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Wide pixel-farm vista at golden hour with three rows of ripe tomato-crops, a scarecrow swaying mid-field, a small farmhouse with warm-lit yellow windows in middle-distance, a pixel-cat curled on the porch, a chicken pecking near a fence-post, layered farmland fading to pink-gold horizon."
- "A beachside fish-shack EXTERIOR at sunset, smoke curling from the chimney, fishing nets hanging on poles outside, two NPC fishermen sorting catch on the dock, two seagulls in flight overhead, gentle wave-foam on the foreground sand, layered pink-orange sky."
- "Wide summer-festival town square with three rows of hanging paper-lanterns strung between rooftops, food carts with steaming pots, three NPCs in kimonos walking, a pixel-cat darting under a stall, drifting cherry-blossom petals, warm orange lantern-glow on cobblestones."
- "Autumn-harvest barn exterior at dusk, pumpkins stacked beside the open barn-door, hay-bales scattered in foreground, two NPCs hauling baskets of squash, a pixel-dog wagging mid-stride, distant scarecrow in golden field."
- "Riverside fishing-pier at dawn with single fisher-NPC mid-cast on the dock, lit lantern hanging from a post, mist rolling over the water, three ducks paddling, dragonfly drifting, lit cabin-window on far bank."
- "Wide orchard at autumn with three apple-trees laden with red fruit, fallen apples on the ground, a pixel-cat lounging in a low branch, NPC farmer hauling a basket, drifting golden leaves, warm sunset light."
- "Cherry-blossom park in spring with petals drifting across the cobblestone path, three NPCs picnicking on a blue checkered blanket, a small river with stone bridge, distant pagoda-silhouette, soft pink morning sky."
- "Wheat-field harvest at golden hour, NPC mid-swing scythe in foreground, hay-bales scattered through middle layer, distant farmhouse with smoke from chimney, pixel-dog mid-stride beside the farmer, drifting golden pollen."

━━━ AVOID ━━━

- Indoor scenes (kitchen / tea-cafe / bakery / greenhouse interior / henhouse interior / hot-spring bath / cabin interior)
- Closeup of hands holding an object / candling-station / product still-life
- Specific named IPs
- Dim / dark scenes — cozy farming is WARM and BRIGHT
- Action-violence
- UI / HUD / menus
- Static empty frames

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
