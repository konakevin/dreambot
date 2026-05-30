#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE ACCESSORY entries — everyday objects the character is using/carrying.

Each entry: 10-18 words. Object + lived-in detail + use-context.

VARIETY:
- 16% DRINK/FOOD (coffee-cup mid-sip / bento-box mid-open / canned-coffee from vendor / ramen-bowl mid-slurp / tea-mug warm in hand / boba-cup mid-sip)
- 14% PHONE/DEVICE (smartphone scrolling / earbuds in ear / laptop with stickers / tablet for sketching / camera mid-snap)
- 12% BOOK/PAPER (paperback novel / manga volume / notebook + pen / sketchbook with charcoal / map with markings)
- 10% TRANSIT (umbrella / commuter pass / bicycle handlebar / scooter helmet / suitcase / backpack strap)
- 10% WORK-TOOL (kitchen knife mid-cut / paintbrush mid-stroke / hammer / camera tripod / sewing-needle / pen behind ear)
- 8% BAG (tote-bag with charm / school-bag slung / messenger-bag / fabric-shopping-bag with groceries / lunchbox)
- 8% PET-RELATED (cat-collar / dog-leash / pet-food bowl in hand / pet-treat / cat-toy)
- 6% INSTRUMENT (acoustic guitar mid-strum / piano-keys / violin-bow / shamisen / harmonica)
- 6% TOILETRY/GROOMING (towel around neck / razor in hand / hair-brush mid-stroke / makeup-mirror)
- 6% CLEANING/HOUSEHOLD (broom / dish-rag / dust-cloth / watering-can / laundry-basket)
- 4% HOBBY (knitting-needles + yarn / fishing-rod / model-kit pieces / chess-piece / origami-paper)

DO write:
- Steaming coffee-cup with chip in rim, held in both hands, faint lip-mark
- Worn paperback novel open at thumb-mark, dog-eared pages curling
- Smartphone with cracked-screen guard, scrolling pose, charm hanging from case
- Folding umbrella half-open, water-droplets clinging to clear vinyl
- Kitchen knife mid-cut on cutting-board, vegetable slices stacked beside

DO NOT: weapons/combat / magical / multiple per entry / photoreal-catalog descriptions.

Everyday + tactile + lived-in.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
