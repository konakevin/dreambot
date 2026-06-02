#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_scene_setting.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII OUTDOOR-VARIETY SCENE SETTINGS for ChibiBot miniature-feast — heavily-decorated cute outdoor environments where chibis + tons of smiling-face food are gathered. Pop-Mart designer-vinyl pastel kawaii register. bex.ai Instagram aesthetic. The viewer's reaction: "I want to PICNIC there with kawaii food and friends!"

Each entry: 22-35 words. ONE specific kawaii setting. NO chibis, NO food hero (those come from other pools) — JUST the setting + its decor.

━━━ HARD RULE: HEAVILY OUTDOOR / VARIED — NOT JUST INDOOR CAFÉS ━━━

Kevin wants VARIETY — picnics, beaches, camping, treehouses, gardens, boats, hot-air-balloons, meadows, mountains, snow. The setting itself implies "we'll spread out a TON of cute food and chibis here." Each setting should already evoke a "feast-party" by its nature.

━━━ CATEGORY DISTRIBUTION ━━━

- 15% PICNIC BLANKET OUTDOORS (gingham picnic-blanket spread in a wildflower meadow with cherry-blossom petals raining down, pastel cushions piled at corners, picnic-basket spilling pastries / pastel-polka-dot picnic blanket in an apple-orchard with hanging pastel-lantern strings, fluffy throw-pillows, wicker basket of treats / lace-trim picnic blanket beside a glittering stream with strawberry-patch nearby, pastel parasols stuck in the grass, scattered floral cushions)
- 15% BEACH KAWAII (sandy-pink beach with pastel-striped beach-umbrella, kawaii towel spread, sand-dollar decorations, pastel bucket-and-spade scattered, gentle waves on a turquoise sea / boardwalk picnic with pastel beach-chairs, hanging kawaii-buoy decor, shaved-ice cart in background, palm-trees with pastel-bunting / tide-pool kawaii nook with pastel shell-decor, smiling starfish, sandy blanket with parasol)
- 15% CAMPING KAWAII (kawaii campsite with tiny pastel-pink tent, log-stool seats, glowing campfire-ring with smiling-face flames, hanging pastel-string-lights between pine-trees / lakeside campout with pastel canoe pulled up, hammock strung between birches, cooler full of treats, kindling-pile / forest-glade camp with mushroom-stools, hanging-lantern-strings, log-table with checkered-cloth, marshmallow-roasting setup)
- 10% TREEHOUSE / FOREST CANOPY (treehouse platform with rope-ladder, hanging-pastel-bunting, mossy table-stump, fairy-light strands, leafy-canopy overhead / forest-canopy picnic on a giant tree-branch with pastel cushions, hanging glass-ball-lanterns, vines tangled with pastel ribbons / floor-of-mossy-glade tea-spot with toadstool stools, fern-canopy)
- 10% GARDEN / GAZEBO (pastel-painted gazebo in a rose-garden with hanging-pastel-bunting, vine-wrapped pillars, lattice-roof with climbing flowers, pastel garden-chairs / botanical-conservatory glass dome with hanging-floral baskets, vine-wrapped iron-table, pastel butterfly-net / cottagecore-garden party with bunting strung between apple-trees and pastel-cushion-arranged grass)
- 5% BOAT / WATER (pastel rowboat with kawaii-striped awning afloat on a glittering lake, with a low picnic-spread on the deck and dangling-pastel-ribbons / lakeside-dock kawaii picnic with pastel beach-mat, hanging-paper-lanterns over the water, calm-mirror lake / pastel-river floating-tube setup with kawaii-floaty-mats and pastel-balloon-string anchors)
- 5% HOT-AIR BALLOON / SKY-PICNIC (pastel-striped hot-air-balloon basket with picnic-spread inside, floating above cotton-candy clouds, pastel ribbons trailing / cloud-tea-table on a fluffy pastel cloud with rainbow-arc backdrop, dangling-star ornaments / pastel-zeppelin gondola with kawaii-window-view and dangling-pastel-bunting)
- 5% MOUNTAIN / ALPINE (alpine-meadow flower-field with snow-capped pastel-mountain backdrop and a wool-blanket picnic / mountain-summit overlook with pastel-pennant-string-lights and a kawaii-thermos picnic-setup / wildflower-hillside with pastel-parasol shade and a low-table-picnic)
- 5% SNOWY KAWAII (pastel snowy meadow with a cozy snow-fort, hanging-pastel-lights, hot-cocoa-thermos in foreground, pine-trees dusted in soft snow / cozy ski-lodge balcony with snowy pastel-mountain view and a kawaii-hot-cocoa setup / snowy garden with twinkling pastel-fairy-lights wrapped around bare trees and a pastel-throw on a sled)
- 5% MEADOW / FAIRYTALE FOREST (sun-dappled flower-meadow with daisies, cosmos, and tulips in pastel hues all around / fairytale-forest clearing with toadstool tables, mossy stumps, hanging-glow-jars / pastel wildflower-glade with floating dandelion-seeds and pastel-paper-lanterns hung on branches)
- 5% ROOFTOP / URBAN GARDEN (rooftop pastel-garden party with hanging-fairy-lights, pastel cushion-pile, low-table picnic, city-skyline backdrop softened to pastel haze / fire-escape kawaii picnic with pastel-fairy-lights wrapped around the railing, throw-blanket spread, hanging-bunting / rooftop greenhouse with potted-pastel-blooms and a small-table picnic)
- 5% KAWAII INDOOR (pastel-pink dessert-café table by a window with cherry-blossom-printed wallpaper, lace-edged tablecloth, mini sugar-bowl / bubble-tea shop counter with pastel-rainbow-stripe wall, macaron-tower display / cottagecore-kitchen with pastel-toaster, hanging-herbs, kawaii apron) — RARE; only 5% indoor.

━━━ HARD MANDATES (every entry) ━━━

- HEAVILY DECORATED — at least 3 kawaii decor elements named (pastel bunting / fairy-lights / cherry-blossom branches / mini-confetti / lace-trim / pastel cushions / paper-lanterns / pastel ribbons / pastel-parasol / kawaii-stickers / etc.)
- PASTEL PALETTE (blush pink, lavender, mint, peach, cream, baby-blue) — never moody / dark / saturated
- POP-MART AESTHETIC — designer-vinyl glossy-pearlescent finish
- "FEAST-PARTY-READY" — the setting itself naturally invites spreading a TON of cute food across it (picnic-blanket / camp-table / boat-deck / tree-table / etc.)

━━━ HARD BANS ━━━

- NO chibis / creatures
- NO food hero / no specific food items
- NO dark / moody / minimalist settings
- NO photorealistic / interior-design-magazine register
- NO modern tech (laptops, phones, etc.)
- NO MORE THAN 10% INDOOR — kawaii feast happens OUTSIDE in the world

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Aim for ~90% outdoor variety.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
