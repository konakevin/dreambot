#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/camp_and_lake.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMPING & LAKESIDE scene descriptions for RetroBot — the family camping trip and the fishing spot, 1975-1995. No people visible. Pure scene/environment. Woods and lake; dawn mist, dusk pines, campfire glow, starlight. The place tells the story.

Each entry: 10-20 words. One specific camping, fishing, or lakeside scene or detail.

━━━ CATEGORIES ━━━
- Canvas A-frame tent at a state-park site, guy-lines, a lantern, sleeping bags
- Campfire ring with folding camp chairs and marshmallow sticks, dusk pines behind
- Station wagon / pop-up camper at the campground, cooler open on the tailgate
- Picnic table with a Coleman two-burner stove, percolator, tin plates, a lantern
- Wooden fishing dock with a rod, tackle box, bobber sitting on still water
- Canoe or aluminum rowboat pulled up on the lake shore, paddles, life vests
- Lakeside cabin porch — screen door, rocking chair, hanging lantern, dawn mist
- Cooler of sodas and a stringer of fish on the dock at golden hour
- Open tackle box — spinners, bobbers, a knife, a tin of worms
- Hammock strung between two pines, paperback face-down
- Trailhead — wooden park sign, a canteen, a compass, hiking boots by a log
- Lake at dawn, low mist on glassy water, a single dock reflection
- Bait shop / boat-launch ramp with a hand-painted sign
- Campfire grate with a cast-iron skillet and a blue enamel percolator
- Inner tube drifting on the lake, a rope swing over the water
- Field of stars over a tent at night, a dying campfire glowing orange

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 — canvas tents, Coleman gear, wood-paneled wagons (no modern ultralight gear)
- Natural light — dawn mist, golden hour, dusk pines, firelight, starlight
- Warm analog film-grain feel
- Gender-neutral — boys and girls both lived this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
