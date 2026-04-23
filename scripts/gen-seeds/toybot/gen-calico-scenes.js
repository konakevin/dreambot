#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/calico_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CALICO-CRITTER / SYLVANIAN-FAMILIES scene descriptions for ToyBot's calico-scene path — cozy daily-life miniature dioramas featuring flocked small-animal figurines (rabbits, bears, foxes, cats, squirrels, mice, raccoons, hedgehogs, sheep) in tiny hand-built dollhouse-scale sets. Every scene is cozy, wholesome, meticulously detailed.

Each entry: 18-28 words. ONE specific cozy vignette with flocked-animal figurines mid-activity in a fully-appointed miniature set.

━━━ THE CHARACTERS ━━━
Flocked velvet-textured small-animal figurines — bunny families, bear couples, fox siblings, cat neighbors, mouse villagers. Each ~3 inches tall with painted eyes, tiny cloth outfits (gingham dresses, knit sweaters, overalls, bonnets, aprons, corduroy shorts). Multiple figurines can appear per scene — this is a community world.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Bunny-family picnic on a red-gingham blanket beside a miniature pond with paper-flower lilypads
- Bear-grandparents reading to tiny cubs in an overstuffed mini-armchair by a glowing cardboard fireplace
- Fox-baker family at their cottage bakery — tiny loaves on wood trays, sprigs of wheat in vase
- Cat family tea-party on a round garden table — mini cups, sugar cubes, cherry pie cut open
- Mouse wedding ceremony in a mushroom-chapel — flower-petal aisle, tiny ring on velvet pillow
- Raccoon-scout troop setting up tents in a mossy campsite — mini lantern, marshmallow-stick
- Hedgehog greengrocer arranging miniature produce pyramids at cottage market stall
- Squirrel schoolhouse — tiny desks, chalkboard with sums, teacher at front with pointer
- Sheep bakery-window — miniature cakes, pies, breads on tiered stands behind glass
- Rabbit-family tucking cubs into mushroom-cap bunk beds, candle-stub on nightstand
- Panda post-office — miniature letters in tiny pigeonholes, stamps on counter, scale-balance
- Owl library loft — flocked-owl perched with mini book, tiny stained-glass window, lantern
- Deer-family autumn leaf-raking scene — tiny rake, wheelbarrow, pumpkin mound, crunchy leaves
- Cat-couple breakfast in a sunlit kitchen — mini egg-cups, toast rack, teapot steaming
- Frog-family pond boat scene — tiny rowboat, fishing-rod, lily-pad dock, cattail reeds
- Bunny gardening scene — watering-can, rows of mini carrots, picket fence, butterfly net
- Bear cafe terrace — tiny patio umbrella, espresso cups, newspaper, geraniums in window box
- Mouse-mother at antique sewing-machine with patchwork quilt draped, tea at elbow
- Hedgehog blacksmith miniature forge — tiny anvil, glowing-orange horseshoe, bellows
- Rabbit birthday party — mini cake with candles, balloons, wrapped presents, streamers
- Squirrel-family boating through a miniature stream with waterwheel turning in background
- Fox-mother knitting scarf by fireplace, basket of yarn balls at feet, cat-figurine asleep on rug
- Seaside bunny beach-scene — tiny beach chairs, striped umbrella, bucket-and-spade, miniature ice-cream cone
- Rabbit-village tree-house climbing scene — tiny ladder, rope bridge, flower-window treehouse
- Bear bathtime scene — clawfoot tub, bubbles, rubber-ducky-figurine, towel rack with mini towels

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference FLOCKED / velvet-texture / figurine / miniature-dollhouse-scale LANGUAGE explicitly
- Cozy daily-life activity — NOT heroic or dramatic
- Tiny specific props — mini cups, tiny rake, miniature loaves, etc.
- Warm practical lighting (window-glow, lantern, fireplace, afternoon-sun)
- Detail-rich fully-appointed set

━━━ BANNED ━━━
- NO "real animal" — these are FIGURINES
- NO humans / human children — all characters are flocked animal figurines
- NO heroic / epic / battle / combat tone
- NO horror / scary / creepy
- NO real-brand names other than generic "Calico Critters" / "Sylvanian" reference implied by DNA

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
