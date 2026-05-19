#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_world_real.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TOY-TRAIN-IN-EVERYDAY-LIFE seed entries for ToyBot's model-train-world path. Each seed describes ONE specific moment of a SMALL TOY TRAIN running on tracks laid out in a recognizable REAL household, yard, or outdoor situation. Like a kid set up the train on the family room floor, in the backyard garden, on the porch, in a sandbox, at a camp site. The setting is the WOW — instantly recognizable everyday spaces.

Each entry: 22-32 words. ONE specific real-everyday setting where a toy train is set up on tracks.

⚠️⚠️⚠️ ABSOLUTE BAN ⚠️⚠️⚠️
- DO NOT say "HO-scale" / "N-scale" / "1:87" / "1:160" — these are Flux's diorama-trigger tokens
- DO NOT say "model train" / "model locomotive" / "model railroad"
- DO NOT say "diorama" / "scratch-built" / "ground-foam" / "lichen-tree" / "plaster-rock" / "static-grass" / "baseboard"
- DO NOT say "miniature world" — the world is REAL, the TRAIN is small

INSTEAD say: "small toy train", "tiny toy locomotive", "kids' toy train set", "Lionel-style toy train", "tracks laid out on", "train running on the floor of", "tracks weaving across"

━━━ REAL-EVERYDAY SETTINGS (rotate aggressively) ━━━

FAMILY-ROOM / INDOORS
- Tracks laid out across a real family-room hardwood floor, real area rug pushed aside, real toy box overflowing in BG, late-afternoon sunlight from real window
- Toy train running on tracks across real basement concrete floor, real cardboard boxes stacked like skyscrapers, single bare bulb light, real workbench in BG
- Train tracks set up on a real kitchen tile floor, real refrigerator looming like a skyscraper, real dropped pencil and pet kibble scattered as obstacles
- Toy train circling beneath a real Christmas tree, real wrapped presents looming, real twinkly lights overhead, real ornaments hanging at sky height
- Tracks running along real wooden window sill, real potted plants as a forest, real condensation on the window pane, golden hour streaming in
- Train laid out across a real coffee table on a quiet evening, real opened book and steaming mug nearby, real lamp casting warm pool of light
- Tracks running through real living-room carpet shag (strands towering like grass), real couch cushion fortresses, dropped toys forming obstacle course
- Toy train circling a real wooden dining table, real plates and mug as buildings, real placemat as grassland, afternoon backlight from real curtains
- Train on tracks across a real hallway runner, real pair of shoes kicked aside as boulders, real coat-rack tower beyond

GARDEN / YARD / OUTDOORS
- Tracks weaving through a real backyard garden bed, real tomato plants towering as forest trees, real garden mulch as ballast, real watering hose coiled nearby like a snake
- Toy train running through real flower garden in spring, real tulips and daffodils as trees, real garden gnome statue in distance, dew on petals
- Tracks laid out across a real driveway, real gravel as boulder field, real grass tufts breaking through asphalt cracks, real dropped rake nearby
- Train tracks running along the edge of a real concrete porch step, real welcome mat as scenery, real garden visible beyond railing, golden hour light
- Toy train circling a real backyard sandbox, real plastic shovel and bucket as buildings, real toy dinosaurs scattered as obstacles, sand dunes as mountains
- Tracks weaving across a real wooden front porch, real planks visible underfoot, real watering can like a water tower, real flower pots as villages
- Train running through a real backyard veggie patch, real lettuce as treetops, real wooden trellis as bridge, real garden hose snaking past
- Toy train on tracks across a real backyard deck, real outdoor furniture as scenery, real BBQ grill looming like factory, sunset over real fence
- Train running along a real garden path of stepping stones, real moss between cracks, real ferns overhanging like jungle canopy
- Tracks running across a real backyard lawn, real grass blades towering, real dandelion as colossal tree, real soccer ball as moon

OUTDOOR-ADVENTURE / NATURE
- Toy train set up on tracks across a real picnic blanket at a campsite, real campfire ring nearby, real tent in BG, real pine needles on tracks
- Tracks running across real forest floor in a hike, real moss bed as grass, real pine cones as boulders, real dappled sunlight through real branches
- Train running along the edge of a real creek bank, real wet stones, real fallen leaves floating in water, real fern fronds curling overhead
- Tracks laid out across a real beach in real wet sand, real seashells as buildings, real tideline as river, real driftwood as fallen trees
- Toy train tracks set up on a real mountain-cabin porch railing, real pine trees beyond, real rocking chair shadow falling across rails
- Train running through real wildflower meadow, real daisies and clover towering, real bumblebee in flight, real golden afternoon light
- Tracks across a real real-rain gutter beside a driveway, real water flowing alongside, real fallen leaves as obstacles, overcast sky
- Toy train on a real tree stump in the woods, real lichen as forest patches, real moss as grass, real squirrel watching from a real branch
- Train running across a real lakeside dock at sunset, real worn wooden planks, real fishing rod leaning, real water lapping below
- Tracks running along the edge of a real backyard fire pit, real glowing embers as cargo, real folding chairs as silhouettes, real stars above

KID / PLAY ROOM
- Train tracks set up across a real kid's bedroom carpet, real LEGO castle nearby, real action figures scattered as crew, real toy box tower in BG
- Toy train circling around a real rug-fortress pillow tower in a real kid's room, real stuffed animals as audience, real nightlight glow
- Tracks running between real building blocks stacked as skyscrapers, real dropped crayons as boulders, real construction paper as billboards
- Train running across a real kid's play mat with road graphics, tracks weaving with the painted roads, real Hot Wheels cars passing alongside
- Tracks on a real kid's small picnic table, real plastic tea-set cups as buildings, real teddy bear as colossal observer, real sunshine streaming

GUTTERS / EDGES / UTILITARIAN
- Toy train running through a real driveway storm gutter, real water flowing alongside, real fallen leaves dammed against rails, real puddle reflections
- Tracks laid out along a real curb edge with real fallen acorns as cargo, real ant trail crossing tracks, real cracked sidewalk concrete
- Train running along a real garage workbench, real tools and screws scattered, real coffee can as cylinder factory, real fluorescent light buzzing
- Tracks weaving through a real shoe rack at the front door, real shoes towering as buildings, real welcome mat as plaza, late afternoon light

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- "small toy train" / "tiny toy locomotive" / "kids' toy train" — NEVER "HO-scale" / "model train"
- Specific REAL household / yard / outdoor environment named explicitly
- REAL objects (real mug / real shoe / real garden hose / real LEGO / real tomato plant) acting as scenery at human scale
- Real-world textures: real grass, real wood, real concrete, real fabric, real sand, real water
- One specific real-world object that visibly dwarfs the train (the mug, the shoe, the watering can, the cat)

━━━ BANNED LANGUAGE ━━━
- "HO-scale" / "N-scale" / "1:87" / "1:160" / "scale-figure"
- "model train" / "model locomotive" / "model railroad" / "diorama"
- "scratch-built" / "ground-foam" / "lichen" / "plaster-rock" / "static-grass" / "baseboard"
- "tilt-shift" / "miniature photography"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string describes one toy-train-in-real-life scenario.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
