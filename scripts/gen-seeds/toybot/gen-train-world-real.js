#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_world_real.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TOY-TRAIN-IN-REAL-WORLD seed entries for ToyBot's model-train-world path. Each seed describes ONE moment of a tiny HO-scale or N-scale model train running through a REAL human environment — NOT a handcrafted diorama. The wow is scale tension: the train is toy-sized, but the SETTING is real (real wood, real moss, real coffee mug, real cat, real kitchen counter). Recognizing real-world objects at toy-train scale is the magic.

Each entry: 22-32 words. ONE specific real-world setting where a tiny model train runs on its tracks. Real surfaces, real lighting, real textures — the toy is INSIDE our world at its tiny scale.

━━━ CRITICAL: REAL WORLD, NOT DIORAMA ━━━
This is NOT scratch-built terrain / ground-foam / plaster-rock. This IS real kitchen surfaces, real moss, real grass, real fabric, real coffee mugs, real cats, real children's hands. The toy train is a small object in a normal-sized human environment. Forced perspective + scale tension is the entire point.

━━━ REAL-WORLD SETTINGS (rotate aggressively) ━━━

KITCHEN / HOME SURFACES
- Tracks across real wooden kitchen table at morning, train weaving between a real coffee mug (skyscraper-tall) and sugar bowl, warm sunlight from real window
- Train circling the rim of a real ceramic cereal bowl, milk lake within, granola boulders, real spoon overhang casting shadow
- Tracks laid across real granite countertop with crumbs as boulders, real pancake stack rising like mountains, syrup river running beside
- Train running along edge of real wooden cutting board, real avocado the size of a hillside, real knife resting nearby like a fallen tree
- Tracks weaving across real piano keyboard, train threading between white keys, real human hand mid-chord overhead
- Train passing beside real Christmas tree base, real evergreen needles like fallen logs, real wrapped present towering behind
- Tracks running across real stack of paperback books on shelf, train balanced on spines, gold-leaf titles like billboards

BEDROOM / KID-ROOM
- Train tracks laid across a real rumpled bedsheet, pillows form mountain peaks, real alarm clock tower in BG, dawn light through curtains
- Tracks running across real carpet shag with strands like grassland, train approaches a real plastic toy dinosaur in scale, real toy cars scattered
- Train passing real sleeping cat curled up — cat fills entire background, scale-perfect whisker macro, train navigates carpet "valley"
- Tracks looping around real LEGO castle on a child's play-rug, real LEGO minifigures wave from castle wall, scale-mismatch wonder
- Train running across real bath-towel river bed, real rubber duck the size of a building, real bath toys scattered as villages
- Tracks weaving through real bookshelf interior, train between real hardcover spines, real bookmark cliff overhanging

OUTDOOR / NATURE (REAL)
- Train tracks running across REAL forest floor, real moss as grass, real pine cones as boulders, real dappled sunlight, real ladybug crossing rail
- Tracks laid through REAL grass lawn, single blades towering, real morning dew on rails, real ant approaching with curiosity
- Train running on top of a real tree stump, real growth-rings as terraced fields, real lichen as forest patches, real chipmunk peering
- Tracks weaving between real mushrooms in real forest moss-bed, mushrooms the size of trees, real fairy-ring composition
- Train passing real seashells on real beach sand, conch shells as caves, real waves in background, scale-perfect grain of sand
- Tracks running across real garden soil between real tomato plants, train as harvesting freight, real ladybug as cargo inspector
- Train approaching real bonsai tree — bonsai IS the forest, real desk surface, real Japanese sand-garden gravel as ballast

PLAY / HOBBY ENVIRONMENTS
- Tracks running through real sandbox, real toy soldiers + plastic dinosaurs scattered, sand dunes as mountains, real plastic shovel as a bridge
- Train tracks across real ping-pong table green, train mid-game-action, real ping-pong balls as floating moons, real paddle as cliff
- Tracks running across real chessboard, train between bishop and knight, scale-perfect black-and-white pattern, real chess pieces as guardian statues
- Train circling a real coffee mug on a real desk, mug as the central skyscraper, steam rising as fog clouds, real laptop in background
- Tracks weaving between real Hot Wheels cars on a child's track, cars as 1:1 vehicles compared to train, scale-mismatch wonder
- Train tracks across real puzzle in progress, train circling completed sections, scattered puzzle pieces as boulder fields

REFLECTIVE / TRANSPARENT
- Train tracks on real glass coffee table with view of carpet below, real plant overhead like a forest canopy, light catching real edge bevel
- Tracks running across surface of real fishtank lid, real fish swimming below as if underwater creatures, real plant ferns as forest
- Train passing real mirror laid flat, train's reflection visible below as another train, surreal infinite-loop visual

SEASONAL / EVENT
- Train tracks laid out beneath a real Christmas tree, real ornaments dangling as celestial bodies, real wrapped presents as cargo destinations
- Tracks running across real Thanksgiving table runner, real pumpkins as mountains, real candles as towering lighthouses
- Train passing real Halloween decorations — real plastic skeleton as ancient ruins, real pumpkin as glowing orb, real spider-webs as flora
- Tracks weaving through real Easter-basket grass with real plastic eggs as boulders, real chocolate bunny standing sentinel

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Train must be EXPLICITLY described as tiny HO-scale or N-scale (1:87 or 1:160)
- Setting must be REAL (real wood, real moss, real cat, real coffee mug) — never "scratch-built", never "scale-built", never "diorama"
- Specific real-world object identified at human-scale that DWARFS the train (the wow)
- Real textures: real grain, real fiber, real dust, real reflection, real condensation
- Real lighting: real window light, real lamp glow, real outdoor sun, real overhead fluorescent

━━━ BANNED LANGUAGE ━━━
- NO "scratch-built" / "ground-foam" / "lichen-tree" / "plaster-rock" / "static-grass" — those are diorama words
- NO "diorama" / "model railroad layout" / "model train layout" / "track on baseboard"
- NO scale-figures inside the train environment as people — humans appear at REAL scale (hand visible, person walking past) or not at all
- NO CGI / illustration / digital-render language
- NO real trademarks (no "Crayola box", "Apple laptop" — generic forms only)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is one toy-train-in-real-world scene description.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
