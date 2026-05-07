#!/usr/bin/env node
/**
 * One-time append: balance jungle_creatures.json with ADULT counterparts to
 * the 200 existing baby entries. Target = 400 total (50/50 baby/adult).
 * After this runs successfully, future from-scratch regens use the updated
 * gen-jungle-creatures.js (which produces 50/50 by default).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_creatures.json',
  total: 400,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ADULT jungle creature descriptions to balance an existing ChibiBot pool. The pool already contains 200 baby/juvenile entries — your job is to add MATURE ADULT counterparts.

Pixar / Sanrio / Studio Ghibli STYLIZED aesthetic — cute, never photoreal, never documentary. But the cuteness is ADULT-cute (mature, characterful, dignified, weathered) — NOT baby-cute (chibi, oversized dewy eyes, blushing cheeks, round-stubby).

Each entry: 10-20 words. ONE specific adult jungle creature with 2-3 identifying details.

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED words anywhere in the entry: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, spawn, larva, juvenile, infant, newborn, tiny.
Adult age is the ONLY age. Describe the species directly ("silverback gorilla", "long-armed orangutan", "weathered jaguar") — don't prepend "adult".

━━━ SPECIES VARIETY — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique jungle/rainforest species. Use the FULL biome — canopy, mid-canopy, understory, jungle floor, jungle stream + amphibians + reptiles + cute insects + mammals + birds + monkeys + sloths + tropical fish + fantasy.

━━━ ADULT JUNGLE/RAINFOREST CREATURES (use widely) ━━━
silverback gorilla, long-armed orangutan, elder chimpanzee, stately gibbon, agile spider-monkey, capuchin elder, howler patriarch, squirrel-monkey trickster, golden lion-tamarin elder, marmoset matriarch, ring-tailed lemur elder, mouse-lemur nightwatcher, sifaka dancer, weathered tarsier, long-fingered bushbaby elder, kinkajou nightclimber, coati matriarch, watchful ocelot, margay tree-stalker, clouded-leopard ghost, mature jaguar with scarred shoulder, full-grown okapi, hardy pangolin, long-tongued anteater, armored armadillo elder, big-bellied capybara matriarch, chestnut agouti, paca with weathered spots, ancient horned-tortoise, two-toed sloth elder, leaf-frog elder, scarlet-throat tree-frog, glass-frog matriarch, weathered green-iguana with full crest, panther chameleon in full color, watchful leaf-tail gecko, long boa coiled lazily, scarlet macaw with worn feathers, hyacinth macaw matriarch, sage parrot, umbrella-cockatoo with regal crest, wise toucan with chipped beak, keel-billed elder, quetzal with full tail-streamer, motmot pendulum-tail elder, dancing manakin elder, mature trogon, hummingbird with iridescent crown, kakapo elder, fruit-bat sage, flying-fox patriarch, blue-morpho on a leaf, owl-butterfly camouflaged, jewel-scarab beetle, walking-leaf insect ancient, leaf-cutter forager-elder, orchid-mantis elder, longhorn beetle, atlas-moth grandmother

━━━ FANTASY / MAGICAL JUNGLE (~25% of entries) ━━━
canopy-mage with vine-staff, orchid-witch with full-bloom crown, moss-elder with stone arms, mushroom-sage with starlit cap, rainforest-shaman with feather-cloak, leaf-spirit ancient, waterfall-priest, flower-queen, firefly-sage in glow-jar, butterfly-witch with morpho-wings, mango-grandmother with golden wings, jaguar-spirit ancient with scars, quetzal-spirit elder, tree-spirit grandmother, raindrop-priest with mist-cloak

━━━ ADULT-CUTE STYLE RULES (replace chibi tropes) ━━━
- ALERT, intelligent, knowing eyes — NOT oversized-dewy-baby-eyes
- Mature, lithe, weathered body proportions — NOT chibi-round-stubby
- Soft expressive face — wise, sage, gentle, watchful, dignified, characterful
- Stylized adult fur/feather/skin — rich tone, layered detail, weather-marks
- Posture: confident, graceful, watchful, mid-action — NOT cuddling-blinking-up-at-camera
- Optional accessories: weathered leather satchel, woven-vine collar, feather-headdress, beadwork necklace, carved-bone earring
- Pose verbs: perched watching, mid-stride along a branch, pausing at a stream-edge, climbing with practiced ease, gazing into distance, basking, hunting (peaceful — no prey shown)

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO predator-prey violence, NO blood, NO showing kill
- NO scary-fanged-snakes, NO real-spiders-with-fangs
- NO sexualized / NO adult themes
- NO identifiable real humans
- NO baby tropes (oversized eyes, blushing cheeks, chibi-round, stubby paws, "adorable")

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Scan "ALREADY GENERATED" carefully — the existing 200 entries are baby versions; your additions must be DISTINCT species, not adult versions of the same babies already listed. Use the FULL species list above.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Silverback gorilla: thick salt-and-pepper coat, knowing amber eyes, seated on a moss-log, vine-twined wrist"
- "Mature jaguar: weathered rosette pelt, pale-green watchful eyes, scarred shoulder, mid-stride on a fallen log"
- "Wise toucan: chipped rainbow beak, knowing dark eye, weathered tail-feathers, alert proud pose"
- "Long-armed orangutan: deep-ginger weathered coat, golden eyes, characterful brow, hand resting on a vine-bridge"
- "Hyacinth macaw matriarch: deep-cobalt plumage with wear-marks, knowing eye, perched regal on a branch"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
