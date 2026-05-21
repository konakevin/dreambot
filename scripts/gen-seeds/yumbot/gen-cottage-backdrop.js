#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_backdrop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} COTTAGECORE-NATURE BACKDROP descriptions for a kawaii cottagecore scene. Each entry is the SURROUNDING natural cottagecore setting that frames the foreground — NOT the foreground characters or activity.

Each entry: 18-30 words. ONE specific cottagecore setting. Atmospheric. NO foreground characters mentioned.

Mix backdrop types broadly:
- Wildflower meadow with rolling hills + stone cottage in the distance
- Cottage garden with white picket fence + climbing roses + lavender bushes
- Woodland clearing with mossy logs + ferns + dappled sunlight
- Orchard with apple trees + fallen blossoms + wooden ladder against a trunk
- Vegetable garden with raised wooden beds + tomato vines + bean trellises
- Cottage interior nook with leaded windows + butter-yellow walls + lace curtains
- Forest meadow with mushroom rings + tall grass + dandelions
- Cottage kitchen garden with herbs in clay pots + dried lavender bundles
- Hay-bale field at golden hour with sunflowers along the fence
- Stone garden path with mossy walls + climbing-honeysuckle archway
- Vintage greenhouse interior with potted seedlings + watering cans
- Cottage windowsill garden with herb pots + dried-flower wreaths above
- Garden gate with climbing wisteria + stone pillars + iron hinges
- Foraging woodland with berry bushes + wildflowers + soft mossy ground
- Cottage porch with rocking chair + flowerpot stairs + bunting overhead
- Wildflower hillside with wooden stile fence + sheep grazing in distance
- Quaint cottage front-door with thatched roof + lavender beds flanking + stone path
- Sunny garden lawn with daisies + clover + a wooden table set for tea
- Backyard fairy garden with stone toadstools + tiny terracotta-house + fairy lights
- Forest stream-side glade with stepping-stones + tall ferns + wildflowers

Examples:
"A wildflower meadow with rolling green hills in the distance, a stone cottage with thatched roof tucked at the horizon, soft summer-haze and tall grasses swaying."
"A cottage garden ringed by a white picket fence, climbing roses cascading over a wooden arbor, lavender bushes in clusters, butter-yellow cottage walls beyond."
"A woodland clearing with mossy logs and dappled sunlight filtering through tall oak branches, soft fern fronds and wildflowers carpeting the ground."

DO NOT write:
- Foreground characters / foods / chefs (separate axis)
- Modern urban / industrial / mall scenes — cottagecore countryside ONLY
- Dark / scary / moody / dirty — bright warm cottagecore palette
- Pathway / lane RECEDING into vanishing point — keep composition clustered/wide
- Real kanji / Japanese / English-script labels — decorative-pattern only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
