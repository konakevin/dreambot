#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE AQUATIC CREATURE descriptions for CuddleBot's cuddly-aquatic path. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Finding-Nemo-baby aesthetic. NEVER photoreal, NEVER documentary nature. Adorable stylized baby aquatic creatures.

Each entry: 10-20 words. ONE specific cute aquatic creature with 2-3 identifying cute details (eye type, body texture, accessories, pose).

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique aquatic species. Zero repeats. Not two sea otters. Not two dolphins. Not two octopuses. Use the FULL aquatic biome — fresh + salt + estuary + tide-pool + reef + arctic-water + tropical-water + freshwater + amphibian + crustacean + cnidarian + cephalopod + tiny-fish + big-cute-mammal + fantasy-aquatic.

━━━ REAL AQUATIC CREATURES (use widely + variants) ━━━
sea otter pup, baby seal, harp seal pup, baby manatee, baby dolphin calf, beluga calf, narwhal calf, baby walrus, sea lion pup, baby orca, baby humpback, baby blue whale, baby dugong, baby axolotl, baby salamander, tadpole, bullfrog tadpole, baby tree-frog (water-side), baby clownfish, baby angelfish, baby pufferfish, baby seahorse, baby goldfish, baby koi, baby betta, baby blue tang, baby butterflyfish, baby moorish idol, baby turtle, baby sea-turtle, hatchling sea-turtle, baby penguin (chick swimming), baby duckling, baby gosling (paddling), baby cygnet, baby flamingo (in shallows), baby pelican (paddling), baby loon, baby grebe, baby coot, hermit crab, tiny crab, baby lobster, baby crayfish, dumbo octopus, baby octopus, baby cuttlefish, baby squid, baby nautilus, jellyfish (moon, baby comb-jelly, mauve, sea-nettle), tiny pink jellyfish, baby manta-ray, baby stingray, leafy sea-dragon baby, weedy sea-dragon baby, blue-ringed octopus baby, baby anemone-fish, baby pipefish, sand-dollar pal, sea-star (cute version), baby sea-urchin, baby coral-polyp critter, baby horseshoe-crab, baby lionfish (de-fanged + chibi), baby seahawk-chick (over water), baby kingfisher, baby moorhen chick, baby coot chick, baby anhinga chick, mermaid-mouse, narwhal-bunny

━━━ FANTASY / MAGICAL AQUATIC (~25% of entries) ━━━
baby kelp-pixie, coral-fairy, baby water-sprite, dewdrop-spirit, bubble-pixie, mermaid-cat, mermaid-bunny, mermaid-puppy, baby siren-pup, baby kraken (smiling, no menace), starfish-fairy, jellyfish-ballerina, baby-rainbow-fish, baby-glow-jellyfish, anemone-pixie, sea-glass-sprite, foam-fairy, tide-pool-pixie, freshwater-nymph

━━━ SUPER OVERLAY CUTE STYLE RULES (MANDATORY EVERY ENTRY) ━━━
- NEVER photoreal — Pixar / Sanrio / Disney-baby-animal stylized
- OVERSIZED dewy eyes (sparkly, reflective, pupils huge)
- ROUND chubby body, soft jelly-soft or velvet-soft texture
- BLUSHING cheeks (or equivalent — pink scale-flush, gill-blush)
- TINY stubby flippers / paws / tentacles
- Optional cute accessories — kelp-bows, anemone-hats, pearl-necklaces, tiny knitted scarves, bubble-tiaras
- Pose: cuddling, blinking up, peeking, holding flippers/paws, nuzzling, sleepy-yawning

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic style
- NO predator-prey violence — NO sharks-with-teeth, NO orcas-attacking, NO blood
- NO scary-deep-sea / NO dark abyss / NO menace
- NO sexualized / NO adult themes
- NO identifiable real humans
- NO realistic ugly fish — make every fish CUTE-CHIBI

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Scan "ALREADY GENERATED" — if any entry is "Sea otter" you cannot write another sea otter entry. "Baby clownfish" and "tiny clownfish" are duplicates. Pick a COMPLETELY DIFFERENT species each time. With 100+ real aquatic + 20+ fantasy aquatic creatures available, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Sea otter pup: enormous shimmering hazel eyes, chubby body, tiny pink paws clutching a clamshell, kelp-bow on its head"
- "Baby axolotl: huge violet eyes, frilly pink gill-fronds blushing pink, soft pearly belly, tiny grin, lotus-leaf hat"
- "Dumbo octopus baby: galaxy-purple body, round dewy eyes, ear-fin flutters, tiny knitted bonnet, eight teeny tentacle-toes"
- "Hermit crab: glossy candy-red shell, googly stalk-eyes, blushing cheeks, pearl-bracelet, peeking out from a daffodil-petal"
- "Baby narwhal: pearl-blue body, oversized dewy eyes, tiny gold horn (no point), heart-shaped pink nose, scarf of seafoam"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
