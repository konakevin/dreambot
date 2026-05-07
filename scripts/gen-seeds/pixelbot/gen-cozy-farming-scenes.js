#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_farming_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} COZY FARMING / LIFE-SIM scene descriptions for PixelBot's cozy-farming-life-sim path. Genre lineage: Stardew Valley + Spiritfarer pixel-tribute + Coffee Talk + Animal Crossing pixel-spinoff + Graveyard Keeper + Ooblets pixel + Story of Seasons.

Each entry: 30-50 words, ONE paragraph, focused on a WARM COZY FARMING / LIFE-SIM moment — tiny pixel farms with crops in neat rows, henhouses with chickens, pixel-cats curled on porches, beachside fish-shacks with smoke curling.

━━━ THE NORTH STAR ━━━

Every scene should feel like "a screenshot from a cozy pixel-life-sim I desperately wish existed and want to play for 200 hours." The frame is a HUG — soft, inviting, generous.

━━━ SCENE TYPES — ROTATE BROADLY ━━━

- Pixel-farm at golden hour with crops in neat rows, scarecrow, lit farmhouse window, pixel-cat on porch
- Henhouse interior at dawn with three chickens, hay nests, sunrise through doorway, basket of eggs
- Beachside fish-shack at sunset with smoke curling, lit interior, fishing nets drying, gulls in flight
- Summer-festival town square with hanging lanterns, food carts, drifting paper-lantern lights
- Autumn-harvest barn with pumpkins stacked, hay-bales, lit windows, distant scarecrow in field
- Spring-rain greenhouse interior with sprouts in pots, dripping rain on glass roof, warm interior glow
- Winter cabin interior with fireplace crackling, knit blanket on chair, snowing outside window
- Riverside fishing-pier at dawn with single fisher-NPC, mist on water, lit lantern, ducks
- Forest-mushroom-foraging scene with NPC kneeling at glowing-cap mushrooms, sunbeam through canopy
- Garden-flower-bed at dawn with bees, butterflies, watering-can, NPC tending blooms
- Beekeeper-cottage with hives in foreground, pixel-bees drifting, smoker-puff, cottage-flowers
- Orchard at autumn with apple-trees laden with fruit, fallen apples on ground, pixel-cat in tree
- Vegetable-stall at market with fresh produce in baskets, awning, NPC vendor, customers
- Lakeside dock with rowboat tied up, lit lantern, NPC fishing, mist rolling, dragonfly drift
- Animal-pasture with sheep grazing, single pixel-dog herding, golden hour, distant farmhouse
- Bakery-kitchen interior with bread on counter, flour-dust drifting, single baker NPC, oven-glow
- Tea-cafe interior with patrons at tables, steaming cups, hanging plants, lit windows
- Nighttime hot-spring outdoor bath with steam rising, lanterns, NPC bathing under stars
- Spring cherry-blossom park with petals drifting, NPCs picnicking on blanket, river running through
- Rooftop-vegetable-garden with planters, hanging tools, sunset light, kettle on small stove

━━━ HARD RULES ━━━

- WARM SOFT LIGHTING — golden hour, sunrise, candle-glow, fireplace-glow, lit window-glow
- ANIMATED-FEEL DETAIL — drifting petals, crops swaying, chimney smoke, animals mid-stride, lit lanterns swaying
- INHABITED FEEL — NPCs going about their day, animals (pixel-cats, dogs, chickens, sheep, ducks, pixel-fish), hanging laundry, lit windows
- LAYERED PARALLAX DEPTH — foreground (immediate scene) + middle (subject) + far (horizon/distant building)
- The frame should be a HUG — soft, safe, inviting
- NEVER mention specific game IPs (Stardew, Animal Crossing by name)
- NEVER include UI / HUD / menus / inventory icons / energy bars

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "A pixel-farm at golden hour with three rows of ripe tomato-crops, a scarecrow swaying in the field, a small farmhouse with warm-lit yellow windows in middle-distance, a pixel-cat curled on the porch, a chicken pecking near a fence-post, layered farmland fading to pink-gold horizon."
- "A beachside fish-shack at sunset, smoke curling from the chimney, warm interior glow through the open doorway, fishing nets hanging to dry, two seagulls in flight overhead, gentle wave-foam on the foreground sand, layered pink-orange sky."
- "A summer-festival town square with three rows of hanging paper-lanterns strung between rooftops, food carts with steaming pots, three NPCs in kimonos walking, drifting cherry-blossom petals, warm orange lantern-glow on cobblestones."
- "A spring-rain greenhouse interior, drifting raindrops on the glass roof, sprouts in clay pots on wooden shelves, a single watering-can on a workbench, hanging herb-bundles, a pixel-cat dozing on a stack of pots, warm interior amber glow."
- "An autumn-harvest barn at dusk, pumpkins stacked beside the open barn-door, hay-bales scattered, a warm-lit interior glow, two NPCs hauling baskets of squash, a pixel-dog wagging mid-stride, distant scarecrow in golden field."

━━━ AVOID ━━━

- Specific named IPs
- Dim / dark scenes — cozy farming is WARM and BRIGHT
- Action-violence elements — this is a peaceful life-sim
- UI / HUD / menus / energy bars / inventory icons
- Static empty frames — always animated-feel + INHABITED

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
