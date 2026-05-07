#!/usr/bin/env node
/**
 * One-shot append: balance jungle_creatures from 100% baby → 50/50 adult/juvenile.
 * Existing pool: 200 baby entries. This appends 200 ADULT-ONLY entries → total 400.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_creatures.json',
  total: 400,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE ADULT JUNGLE CREATURE descriptions for CuddleBot's jungle-canopy path. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Encanto aesthetic. Adorable stylized ADULT jungle/rainforest creatures. NEVER photoreal, NEVER documentary nature.

This batch BALANCES an existing pool of 200 baby/juvenile entries. Your job is ADULTS ONLY so the final pool reaches 50/50.

Each entry: 10-20 words. ONE specific cute ADULT jungle creature with 2-3 identifying cute details.

━━━ STRICT AGE RULE — NON-NEGOTIABLE ━━━
Every entry features a FULL-GROWN ADULT animal. The vibe: mature, settled, dignified, weathered-but-still-cute.
ABSOLUTELY BANNED words/prefixes: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, young.
Use instead: adult, mature, grown, full-grown, old, elder, weathered, wise, settled, broad, long-whiskered, gnarled, dignified, stout, lone, wandering.

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique jungle/rainforest species. Zero repeats. Use the FULL rainforest biome — canopy, mid-canopy, understory, jungle floor, jungle stream + amphibians + reptiles + mammals + birds.

━━━ REAL ADULT JUNGLE/RAINFOREST CREATURES (use widely + variants) ━━━
adult sloth (two-toed), adult sloth (three-toed), adult tapir, mature orangutan with silvered cheeks, settled gorilla silverback, mature chimpanzee, adult gibbon, adult spider-monkey, adult capuchin, adult howler-monkey, adult squirrel-monkey, adult titi-monkey, adult tamarin, adult marmoset, adult pygmy-marmoset, full-grown ring-tailed lemur, mature mouse-lemur, settled sifaka, adult tarsier with huge eyes, adult slow-loris, adult bushbaby, adult kinkajou, adult olingo, adult coati, adult ocelot, adult margay, adult clouded-leopard, adult tiger, adult jaguar (chibi-cute round), adult okapi, adult pangolin, adult anteater with long snout, adult armadillo, broad adult capybara, adult agouti, adult paca, adult forest chinchilla, adult red-eyed tree-frog, adult poison-dart frog (pastel-cute), adult glass-frog, adult horned-frog, adult leaf-frog, adult axolotl elder, adult coqui, adult caiman (smiling chibi), adult green-iguana, adult anole, adult panther chameleon, adult veiled chameleon, adult leaf-tailed gecko, adult emerald day-gecko, adult tree-snake (chibi smiling, no fangs), adult boa-constrictor (round + smiling), adult toucan, adult keel-billed toucan, adult aracari, adult scarlet macaw, adult blue+gold macaw, adult hyacinth macaw, adult amazon parrot, adult umbrella cockatoo, adult quetzal, adult motmot, adult honeycreeper, adult manakin, adult cotinga, adult trogon, adult tropical hummingbird, adult parakeet, adult kakapo, adult tropical kingfisher, adult fruit-bat (megabat with sweet face), adult flying-fox, adult leaf-katydid, adult praying-mantis (chibi), adult blue-morpho butterfly, adult owl-butterfly, adult orchid-mantis, adult walking-leaf-insect, adult leaf-cutter-ant (carrying leaf), adult jewel-scarab beetle, adult mouse-deer/chevrotain.

━━━ FANTASY / MAGICAL ADULT JUNGLE (~25% of entries) ━━━
elder canopy-pixie, mature vine-fairy, ancient orchid-sprite, wise moss-sprite, gnarled mushroom-sprite, settled rainforest-nymph, old leaf-spirit, elder waterfall-pixie, mature jungle-bloom fairy, wise firefly-elder, mature blue-morpho fairy, elder mango-pixie, dignified banana-fairy, ancient jaguar-spirit, elder quetzal-spirit, mature tree-spirit, elder raindrop-pixie.

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Pixar / Sanrio / Disney stylized — NEVER photoreal
- ADULT proportions allowed: longer body, fully developed limbs, dignified posture
- Eyes still expressive but a bit narrower / wiser than baby-huge
- Soft fluffy/velvet textures, optional gentle weathering (silver-tipped fur, scarred ear notch, gnarled paw)
- Optional cute accessories: banana-leaf-hats, flower-crowns, vine-bracelets, palm-frond-fans, lotus-rings, tiny carved walking-stick
- Pose: settled, watching, perched proudly, walking purposefully, sun-warming, gathering — never baby-cuddling-up, never blinking-up-helpless

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO predator-prey violence — NO jaguar-pouncing, NO snake-constricting, NO blood
- NO scary-snakes / NO realistic-spiders-with-fangs
- NO sexualized / NO adult themes
- NO identifiable real humans
- NO baby/juvenile language (see STRICT AGE RULE above)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE ADULT SPECIES NAME. Scan "ALREADY GENERATED" carefully — including the existing 200 baby entries (don't repeat the species name even at a different age). With 100+ real jungle + 17 fantasy adults available, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Adult sloth: long mossy-green velvet fur with silver-tipped tufts, half-closed contented eyes, settled across a thick vine, peaceful smile"
- "Adult red-eyed tree-frog: enormous ruby eyes wise with age, lime-green velvet skin, perched on a wide leaf surveying the canopy"
- "Mature capybara: broad barrel-body, dewy hazel eyes, weathered ears, neutral half-smile, soaking in a hot spring with dignity"
- "Adult toucan: oversized rainbow beak gleaming, sharp eyes, perched proudly atop a banana cluster, alert and watchful"
- "Mature orangutan: silvered ginger fur halo, expressive gold eyes, broad knuckle-paws, holding a leaf-umbrella with practiced ease"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
