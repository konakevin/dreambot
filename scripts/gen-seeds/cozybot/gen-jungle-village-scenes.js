#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cozybot/seeds/jungle_village_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} JUNGLE-VILLAGE SCENE descriptions for CuddleBot's jungle-village path. Cozy rainforest / canopy / cloud-forest / mangrove VILLAGES + TREEHOUSES + JUNGLE-CLEARINGS that the viewer wants to move into. The ARCHITECTURE and ATMOSPHERE are the hero — not the creatures. Pixar / Sanrio / Studio Ghibli / Encanto / Princess-Mononoke aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 18-28 words. ONE specific jungle-village scene with COZY ARCHITECTURE detail.

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute baby jungle creature in the scene — sloth swinging on a vine-bridge, baby toucan perched on a balcony, capybara soaking in a hot-spring, baby tree-frog peeking from a leaf-window, lemur sweeping a leaf-doorstep. The CRITTER + the COZY VILLAGE together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- Treehouse village in giant ceiba — multiple hut-rooms in one huge tree, rope-ladders, lantern-vines connecting
- Mushroom-house clearing — cluster of giant-mushroom cottages in a sun-dappled clearing, fern-hedges, moss paths
- Vine-bridge village — rope-and-vine bridges connecting tiny canopy huts, lantern-flowers strung between
- Jungle-floor market square — bark-thatch market stalls in a clearing, fruit-baskets, woven-leaf awnings
- Canopy-platform tea-house cluster — woven-leaf platforms high in the canopy, leaf-cups, vine-string-lights
- Hanging-bottle-house cluster — gourd-bottle cottages hanging from vines, tiny windows, lantern-flowers below
- Mossy log-village — cluster of cottages built into a giant fallen log, mushroom shelves, pixie-cup-lanterns
- Cloud-forest mist village — huts perched on cliff-ledges in pearl-mist, sun-shafts, fern-curtain doorways
- Mangrove-root village — cottages on mangrove roots above shallow water, rope-bridge connectors, hammock-deck
- Banana-tree market — banana-tree-grove with market stalls between, bunting of tiny flowers, fallen-leaf cobblestones
- Hot-spring spa-village — cottages around a steaming turquoise hot-spring, bamboo-pipe water, fern-soft towels
- Jungle-stream waterwheel village — cottages along a gentle stream with a moss-covered waterwheel, lily-pad-bridges
- Orchid-greenhouse village — village inside a natural orchid-cathedral, dewdrops, butterfly-clouds, dappled gold light
- Treetop observatory village — cluster of telescope-treehouses high in canopy, vine-string-lights, star-charts on plank walls
- Lantern-flower night village — village lit only by giant lantern-flowers, soft pink+amber glow, vine-strung garlands
- Bamboo-grove hamlet — bamboo-pole cottages in a tall bamboo grove, dappled gold light, soft moss-carpet
- Vine-swing playground village — village clustered around a vine-swing playground, soft-grass landing, flower-confetti
- Toucan tea-balcony village — multiple flower-bract balconies all level in the canopy, tiny tea-sets out, banana garlands
- Riverside hammock-village — cottages along a calm river-bend with hammocks slung between trees, lily-pads at the bank

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: bark-and-thatch huts, mossy roofs, flowering-vine drapes, hanging-fruit-bowl windows, woven-vine railings, glow-mushroom streetlamps, lantern-flowers at every door
- Warm leaf-green + sun-gold + coral-flower-pink + banana-yellow + sky-mint + warm window-amber palette
- Sun-dapples filtering through giant leaves, mist drifting, dewdrops on ferns, butterflies fluttering
- The village feels LIVED IN — woven-baskets at doors, drying herbs hanging from rafters, banana-leaf laundry, fruit-stall crates, fern-broom against a wall
- Optional small peripheral creature (sloth, capybara, frog, monkey, toucan, mouse-deer) doing something cute in the village

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary jungle / NO predator-with-teeth / NO dangerous-snake-coil
- NO realistic dirt + grime + biting-insect-swarm
- NO modern infrastructure (no actual roads, no power-lines, no concrete)
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village-type + key-architectural-feature + time-of-day + creature-vs-empty. Vary VILLAGE-TYPE + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Treehouse village in a giant ceiba at sun-dappled noon, multiple hut-rooms with rope-ladders, lantern-vines strung between, soft moss-platforms"
- "Empty mushroom-house clearing at dawn, cluster of giant-mushroom cottages, mist drifting between, fern-hedges, glow-mushroom streetlamps still lit"
- "Sloth on a vine-bridge between two canopy huts, soft sun-dappled light, lantern-flowers strung along the rope, ferns dangling below"
- "Cloud-forest mist village, huts perched on cliff-ledges, pearl-mist drifting, sun-shafts piercing through giant ferns, fern-curtain doorways still"
- "Capybara soaking in a hot-spring spa-village, cottages around the steaming turquoise pool, bamboo-pipe water, fern-soft towels on a moss-rack"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
