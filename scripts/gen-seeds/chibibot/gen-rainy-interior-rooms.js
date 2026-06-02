#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_rooms.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} OUTDOOR RAINY-DAY SETTINGS for ChibiBot rainy-day-outdoor path — the SCENE where adorable chibi creatures play outside in the rain. Wet flower gardens with creatures splashing in puddles, lakeside docks with rain hitting the water, cobblestone village lanes with reflected lamplight, muddy garden paths with creatures stomping in boots, forest paths with rain pattering the leaves overhead, hilltops with creatures sharing an umbrella, parks with rain-jeweled grass, courtyards with paper-boat-puddle races.

Each entry: 15-25 words. ONE specific outdoor rainy setting. NO creatures (separate axis). NO time-of-day (separate axis). NO activity (separate axis). Just the setting.

━━━ THE BAR — RAINY OUTDOOR PLAY ━━━

Every entry must (1) be UNMISTAKABLY OUTDOOR, (2) clearly show RAIN-AFFECTED environment (wet surfaces, puddles, dripping leaves, rain-soaked petals, mud, dripping eaves), and (3) feel like a spot a chibi creature could play / wander / linger / splash / shelter in the rain.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% village street / cottagecore lane (cobblestone village street with reflected lamplight in puddles / wet bakery storefront with rain-glistening awning / rainy market square with closed striped umbrellas / cottage lane with wet picket fence and dripping climbing-roses)
- 15% flower garden / wildflower meadow (rain-soaked rose garden with petals stuck to wet stones / wildflower meadow with raindrops jeweled on every blade of grass / muddy vegetable garden with rain pooling in the rows / cottage herb garden glistening wet)
- 15% lakeside / dock / pond (wooden dock with rain hitting the water in concentric ripples / lily-pad pond with raindrops drumming the lily pads / mossy stream with rain dappling the surface / lake-edge with overturned canoes filling with rainwater)
- 10% forest path / clearing (mossy forest path with rain pattering through the canopy / forest clearing with a mushroom-cap shelter / drenched fern grove with water beading on every frond / pine-needle path with rain dripping from boughs)
- 10% rural / pastoral (muddy farm lane with puddle-pocked ground / hilltop meadow with rain sweeping across in misty curtains / stone-walled sheep pasture with sheep huddled under a tree / cliffside meadow with rain blowing sideways)
- 10% courtyard / patio (mossy courtyard with rain pooling in stone basins / brick patio with rain-glossy chairs / Japanese garden with rain rippling a koi pond / cottage backyard with laundry blowing on a line)
- 10% bridge / waterway (stone footbridge over a rushing brook in the rain / wet wooden bridge with rain making the planks dark / cobblestone arch-bridge with puddles below)
- 5% magical realm (fairy-ring clearing with rain making mushroom caps glow / mossy ancient ruins with rain pooling in carved bowls / forest glade with rainbow-light through rain)
- 5% beach / coast (wet sand cove with rain dotting the shoreline / tide-pool rocks glistening with rain / fishing pier with rain blowing in from the sea)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete outdoor location anchor + specific RAIN-AFFECTED detail (wet cobblestones, dripping eaves, puddle-pocked, rain-jeweled, glistening, soggy)
- Material truth + signature visible-rain element
- Picture-able as a single still

━━━ HARD BANS ━━━

- NO creatures or characters
- NO interior / indoor scenes (this is OUTDOOR-only)
- NO mention of windows looking out
- NO time-of-day language
- NO sunny / dry imagery (rain is the baseline)
- NO storm-damage / scary / flooded / dangerous undertones — wholesome wet
- NO activity verbs

━━━ DEDUP ━━━

Dedup by: setting type + signature rain-affected detail.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
