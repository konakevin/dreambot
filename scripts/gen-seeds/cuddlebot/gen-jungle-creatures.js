#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/jungle_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE JUNGLE CREATURE descriptions for CuddleBot's jungle-canopy path. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Jungle-Book / Encanto / Madagascar-baby aesthetic. NEVER photoreal, NEVER documentary nature. Adorable stylized baby jungle/rainforest creatures.

Each entry: 10-20 words. ONE specific cute jungle creature with 2-3 identifying cute details (eye type, body texture, accessories, pose).

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique jungle/rainforest species. Zero repeats. Use the FULL rainforest biome — canopy, mid-canopy, understory, jungle floor, jungle stream + amphibians + reptiles + insects (cute) + mammals + birds + monkeys + sloths + tropical-fish-from-jungle-streams + fantasy-jungle.

━━━ REAL JUNGLE/RAINFOREST CREATURES (use widely + variants) ━━━
baby sloth (two-toed), baby sloth (three-toed), baby tapir, baby orangutan, baby gorilla, baby chimpanzee, baby gibbon, baby spider-monkey, baby capuchin-monkey, baby howler-monkey, baby squirrel-monkey, baby titi-monkey, baby tamarin, baby marmoset, baby pygmy-marmoset, baby lemur (ring-tailed), baby lemur (mouse-lemur), baby lemur (sifaka), baby tarsier, baby loris, baby galago/bushbaby, baby kinkajou, baby olingo, baby coati, baby ocelot kitten (chibi-cute), baby margay kitten, baby clouded-leopard cub, baby tiger cub, baby jaguar cub (round + chibi), baby okapi, baby pangolin, baby anteater, baby armadillo, baby capybara, baby agouti, baby paca, baby chinchilla (forest), baby tree-frog (red-eyed), baby tree-frog (poison-dart cute-pastel), baby glass-frog, baby horned-frog, baby leaf-frog, baby axolotl (jungle stream), baby coqui, baby caiman (smiling chibi), baby green-iguana, baby anole, baby chameleon (panther), baby chameleon (veiled), baby gecko (leaf-tailed), baby gecko (day-gecko-emerald), baby tree-snake (chibi-cute, no fangs), baby boa-constrictor (round + smiling), baby toucan, baby keel-billed toucan, baby aracari, baby macaw (scarlet), baby macaw (blue+gold), baby macaw (hyacinth), baby parrot (amazon), baby cockatoo (umbrella), baby quetzal, baby motmot, baby honeycreeper, baby manakin, baby cotinga, baby trogon, baby hummingbird (tropical), baby parakeet, baby kakapo, baby tropical kingfisher, baby fruit-bat (megabat with sweet face), baby flying-fox, baby leaf-katydid, baby praying-mantis (chibi-cute), baby blue-morpho butterfly, baby owl-butterfly, baby giant-millipede (with tiny shoes), baby orchid-mantis, baby walking-leaf-insect, baby leaf-cutter-ant (with cute leaf), baby beetle-jewel-scarab, baby capybara-pup-with-bird-friend, baby tapir-with-stripes, baby mouse-deer/chevrotain

━━━ FANTASY / MAGICAL JUNGLE (~25% of entries) ━━━
baby canopy-pixie, baby vine-fairy, baby orchid-sprite, baby moss-sprite, baby mushroom-sprite, baby rainforest-nymph, baby leaf-spirit, baby waterfall-pixie, baby flower-fairy (jungle-bloom), baby firefly-spirit (canopy-glow), baby butterfly-fairy (blue-morpho), baby mango-pixie, baby banana-fairy, baby jaguar-spirit-cub, baby quetzal-spirit, baby tree-spirit-cub, baby raindrop-pixie

━━━ SUPER OVERLAY CUTE STYLE RULES (MANDATORY EVERY ENTRY) ━━━
- NEVER photoreal — Pixar / Sanrio / Disney-baby-animal stylized
- OVERSIZED dewy eyes (sparkly, reflective, pupils huge)
- ROUND chubby body, soft fluffy/velvet/jelly textures
- BLUSHING cheeks
- TINY stubby paws / claws / wings
- Optional cute accessories — banana-leaf-hats, flower-crowns, vine-bracelets, palm-frond-fans, lotus-ring
- Pose: cuddling, blinking up, peeking, holding-paws, nuzzling, sleepy-yawning, hanging from a vine

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO predator-prey violence — NO jaguar-pouncing, NO snake-constricting, NO blood
- NO scary-snakes / NO realistic-spiders-with-fangs
- NO sexualized / NO adult themes
- NO identifiable real humans
- NO realistic-ugly-jungle-creatures — make every species CUTE-CHIBI

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Scan "ALREADY GENERATED" carefully. "Baby tree-frog (red-eyed)" and "baby tree-frog (green)" are duplicates IF the unique name is just "tree-frog" — vary the species enough to read as different. With 100+ real jungle + 20 fantasy creatures available, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Baby sloth: huge half-closed dewy eyes, mossy-green velvet fur, gentle smile, tiny pink paw-pads, hanging from a vine"
- "Baby red-eyed tree-frog: enormous shimmering ruby eyes, lime-green velvet skin, blushing cheeks, suction-cup paws, perched on a leaf"
- "Baby capybara: chunky barrel-body, dewy hazel eyes, rosy-pink ears, half-smile, tiny lily-pad hat, soaking in a hot spring"
- "Baby toucan: oversized rainbow beak, button eyes, soft sky-blue chest, blushing cheek, perched proudly on a banana"
- "Baby orangutan: huge gold dewy eyes, fluffy ginger fur halo, blushing cheeks, tiny pink paws clutching a leaf-umbrella"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
