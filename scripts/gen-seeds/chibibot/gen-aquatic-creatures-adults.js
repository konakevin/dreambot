#!/usr/bin/env node
/**
 * One-time append: balance aquatic_creatures.json with ADULT counterparts.
 * Existing 200 entries are 85% baby; target = 340 total (~50/50 after append).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_creatures.json',
  total: 340,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ADULT aquatic creature descriptions to balance an existing ChibiBot pool. The pool currently leans heavily juvenile — your job is to add MATURE ADULT counterparts.

Pixar / Sanrio / Studio Ghibli / Finding-Nemo STYLIZED aesthetic — cute, never photoreal. ADULT-cute (mature, weathered, dignified, characterful) — NOT baby-cute.

Each entry: 10-20 words. ONE specific adult aquatic creature (saltwater, freshwater, tide-pool, deep-sea-magical).

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED words: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, infant, newborn, tiny, fry.

━━━ SPECIES VARIETY — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique aquatic species across saltwater + freshwater + tide-pool + magical-aquatic.

━━━ ADULT AQUATIC CREATURES (use widely) ━━━
mature sea otter floating with crossed paws, harbor seal with knowing eyes, ringed seal elder, walrus patriarch on a floe, manatee grazing seagrass, dugong matriarch, dolphin elder mid-leap, beluga surfacing, narwhal with single full tusk, orca matriarch breaching, humpback whale with barnacled fluke, blue whale slow-passing, sperm whale grandmother diving, gray whale with weathered skin, sea-turtle elder paddling, leatherback turtle ancient, hawksbill with patterned shell, green-turtle weathered, dumbo octopus drifting, common octopus matriarch in cave, cuttlefish elder pulsing color, nautilus ancient with spiral shell, giant manta ray gliding, eagle ray gracefulist, leopard shark gentle-cruiser, nurse shark elder resting, whale-shark filter-grazing, hammerhead matriarch, mature seahorse with curled tail, leafy sea-dragon ancient, weedy sea-dragon elder, pufferfish elder fully unpuffed, parrotfish elder grazing coral, angelfish ancient with flowing fins, butterflyfish elder, lionfish stately with full plumes, mandarinfish elder, clownfish patriarch in anemone, surgeonfish, royal-blue tang elder, mature mahi-mahi shimmering, marlin patriarch leaping, sailfish with raised dorsal, swordfish elder, mature mackerel-shoal-elder, herring elder, salmon patriarch returning upstream, trout elder in mountain stream, koi grandmother in pond, betta with full flowing fins, weathered crab matriarch, hermit-crab patriarch in nautilus shell, fiddler-crab elder, lobster patriarch with weathered shell, spiny lobster elder, mantis-shrimp ancient with full color, jellyfish matriarch with long flowing tendrils, comb-jelly elder, sea-anemone grandmother, sea-cucumber elder, starfish patriarch with full arms, brittle-star elder, sand-dollar ancient, sea-urchin matriarch with spines, sea-snake gracefulist, weathered horseshoe-crab patriarch, frog elder by lily-pad, mature toad sage on a rock, freshwater muskrat elder, mature beaver building dam, river-otter patriarch sliding, mink at a riverbank

━━━ FANTASY / MAGICAL AQUATIC (~25% of entries) ━━━
mermaid elder with silver scales, kelpie patriarch (gentle), water-nymph ancient with reed-crown, river-spirit grandmother, lake-shaman with shell-cloak, ocean-priest with coral-staff, tide-witch with sea-foam hair, pearl-diver elder spirit, kraken-spirit small (gentle, not menacing), sea-dragon ancient (small + benevolent), siren-elder (gentle), naiad-grandmother, frog-king with gold crown, turtle-sage with mossy shell, octopus-sage with eight arms, sea-glass-spirit, whale-spirit ancient

━━━ ADULT-CUTE STYLE RULES ━━━
- ALERT, knowing, gentle eyes — NOT oversized-dewy-baby-eyes
- Mature, sleek, weathered body — NOT chibi-round-stubby
- Soft expressive face — wise, watchful, dignified, characterful
- Adult skin/scale: weathered, barnacle-marked, full-color, layered detail
- Posture: graceful, drifting, mid-action, watchful
- Optional accessories: pearl-bead necklace, kelp-woven crown, shell-pendant, sea-glass earring, woven-coral collar
- Pose verbs: drifting through kelp, gliding past coral, pausing at a tide-pool, surfacing for air, basking in sun-shafts, gracefully turning, mid-leap

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary deep-sea / NO predator-with-fangs / NO horror
- NO trash / oil-spill / pollution
- NO sexualized
- NO identifiable real humans
- NO baby tropes (oversized eyes, blushing, chibi, stubby)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Existing 200 entries are baby versions — your additions must be DISTINCT adult species, not adult versions of the babies already listed.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Mature sea otter: weathered cream coat, knowing amber eyes, floating belly-up with paws crossed over chest"
- "Octopus matriarch: deep-coral mantle with knowing eye, eight tendrils curled gracefully in a coral-cave"
- "Wise sea-turtle: barnacled patterned shell, gentle gold eyes, paddling through dappled sun-shafts"
- "Cuttlefish elder: pulsing iridescent skin, watchful W-shaped pupils, drifting between sea-fans"
- "Salmon patriarch: weathered silver-blue body, knowing eye, mid-leap up a mountain stream"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
