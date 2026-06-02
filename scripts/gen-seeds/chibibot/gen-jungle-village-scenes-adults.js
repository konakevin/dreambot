#!/usr/bin/env node
/**
 * One-time append: balance jungle_village_scenes.json with ADULT-creature
 * scenes. Existing 200 entries are 97% baby-creature scenes; target = 390
 * total (~50/50 after append).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_scenes.json',
  total: 390,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} JUNGLE-VILLAGE SCENE descriptions for CuddleBot's jungle-village path. The existing pool features baby creatures in every scene — your job is to add ADULT-creature scenes (and some empty-architecture scenes) to balance.

Cozy rainforest / canopy / cloud-forest / mangrove VILLAGES + TREEHOUSES + JUNGLE-CLEARINGS. Pixar / Sanrio / Studio Ghibli / Encanto STYLIZED — never photoreal, never documentary.

Each entry: 18-28 words. ONE specific jungle-village scene with COZY ARCHITECTURE detail.

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED creature-words: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, infant, newborn, tiny.
EVERY creature mentioned must be ADULT — described as adult, mature, weathered, full-grown, elder, sage, patriarch, matriarch, dignified.

━━━ CRITTER MIX RULE ━━━
- ~75% of entries: scene includes ONE adult creature doing village life (peripheral, not center)
- ~25% of entries: PURE architecture, no creature visible (just the village)

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- Treehouse village in giant ceiba — multiple hut-rooms in one tree, rope-ladders, lantern-vines
- Mushroom-house clearing — giant-mushroom cottages in sun-dappled clearing, fern-hedges, moss paths
- Vine-bridge village — rope-and-vine bridges connecting canopy huts, lantern-flowers strung between
- Jungle-floor market square — bark-thatch market stalls in a clearing, fruit-baskets, woven-leaf awnings
- Canopy-platform tea-house cluster — woven-leaf platforms in canopy, leaf-cups, vine-string-lights
- Hanging-bottle-house cluster — gourd-bottle cottages hanging from vines, lantern-flowers below
- Mossy log-village — cottages built into a giant fallen log, mushroom shelves, pixie-cup-lanterns
- Cloud-forest mist village — huts on cliff-ledges in pearl-mist, sun-shafts, fern-curtain doorways
- Mangrove-root village — cottages on mangrove roots above shallow water, rope-bridge connectors
- Banana-tree market — banana-grove with stalls between, bunting of orchid-flowers
- Hot-spring spa-village — cottages around steaming turquoise hot-spring, bamboo-pipe water
- Jungle-stream waterwheel village — cottages along gentle stream, moss-covered waterwheel
- Orchid-greenhouse village — village inside natural orchid-cathedral, dewdrops, butterfly-clouds
- Lantern-flower night village — village lit by giant lantern-flowers, soft pink+amber glow
- Bamboo-grove hamlet — bamboo-pole cottages in tall bamboo grove, dappled gold light
- Riverside hammock-village — cottages along calm river-bend with hammocks slung between trees

━━━ ADULT JUNGLE CREATURES (when present) ━━━
silverback gorilla, long-armed orangutan, mature jaguar, weathered toucan, scarlet macaw, ring-tailed lemur elder, capuchin matriarch, sloth elder hanging, capybara matriarch soaking, tapir patriarch grazing, mature okapi, anteater foraging, watchful ocelot, agile spider-monkey, sage parrot, hyacinth macaw matriarch, kinkajou nightclimber, coati matriarch, panther chameleon, weathered green-iguana, leaf-frog elder, owl-butterfly resting, jungle-shaman with feather-cloak, orchid-witch, canopy-mage with vine-staff

━━━ COZY OVERLAY (every entry) ━━━
- Architecture rendered with obsessive cozy detail: bark-and-thatch huts, mossy roofs, flowering-vine drapes, hanging-fruit-bowl windows, woven-vine railings, glow-mushroom streetlamps, lantern-flowers at every door
- Warm leaf-green + sun-gold + coral-flower-pink + banana-yellow + sky-mint + window-amber palette
- Sun-dapples through giant leaves, mist drifting, dewdrops, butterflies fluttering
- Village feels LIVED IN — woven-baskets at doors, drying herbs from rafters, banana-leaf laundry, fruit-stall crates, fern-broom against a wall
- Adult creature (when present) is peripheral, doing village life — going to market, mending a roof, watching from a porch, tending a garden, drying herbs

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary jungle / NO predator-with-prey / NO snake-fang
- NO modern infrastructure (no cars, power-lines, concrete)
- NO identifiable humans
- NO baby creatures (see banned-words above)
- NO chibi tropes (oversized eyes, blushing, stubby paws)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
Deduplicate by: village-type + key-architectural-feature + creature-species (or empty) + time-of-day. Vary VILLAGE-TYPE + ADULT-SPECIES + UNIQUE-ARCHITECTURAL-DETAIL across entries. Scan "ALREADY GENERATED" carefully — those are baby-creature versions; yours must use DIFFERENT adult species and DIFFERENT activities.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Silverback gorilla seated on a porch of a treehouse village at dawn, vine-bridges to neighboring huts, sun-dapples through canopy"
- "Empty mushroom-house clearing at midday, sun-dappled giant-mushroom cottages, fern-hedges, glow-mushroom streetlamps unlit"
- "Orangutan elder mending a thatched roof in a hanging-bottle-house cluster, gourd-bottle cottages on vines, lantern-flowers below"
- "Wise toucan perched on a market sign at noon in a banana-tree village, fruit-stalls below, orchid-bunting strung overhead"
- "Cloud-forest mist village at dawn, huts on cliff-ledges, pearl-mist drifting, fern-curtain doorways still, no creatures"
- "Capybara matriarch soaking in a turquoise hot-spring spa-village, bamboo-pipe water, fern-soft towels on moss-rack, steam rising"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
