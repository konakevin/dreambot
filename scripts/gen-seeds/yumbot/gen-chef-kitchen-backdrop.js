#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_kitchen_backdrop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} KAWAII KITCHEN BACKDROP descriptions for a mini-chef kitchen scene. Each entry is the SURROUNDING KITCHEN SETTING that frames the foreground — NOT the foreground characters or activity.

Each entry: 18-30 words. ONE specific kawaii kitchen setting. Atmospheric. NO foreground characters mentioned.

Mix kitchen types broadly:
- Cozy cottage kitchen with copper pots hanging from rafters + butter-yellow walls
- French patisserie with pastel-mint cabinets + macaron display + golden chandelier
- Japanese sushi-bar with cedar counter + paper-lantern + bamboo screens behind
- Italian trattoria kitchen with terracotta tiles + hanging garlic + checkered cloth
- Open-air ramen-shop kitchen with steaming broth-vat + bamboo blinds
- Cozy bakery with brick oven + flour-dusted wooden tables + window-sill of cooling pies
- Mid-century home kitchen with mint-pastel appliances + checkered floor + sunny window
- Studio Ghibli kawaii kitchen with stone hearth + hanging herbs + leaded windows
- French country kitchen with farmhouse sink + lavender bunches + butter-cream cabinets
- Tea-house kitchen with kettle + porcelain rack + paper-screens
- Macaron-shop kitchen with pastel cabinets + display case + golden trim
- Bento-prep kitchen with bamboo box stack + chopstick rack + cherry-blossom window
- Cake-bakery kitchen with stand-mixer + tiered cake stands + sprinkles in jars
- Mochi-pounding station with wooden mortar + bamboo screen + Japanese-garden window
- Boba-tea kitchen with tapioca-pearl jars + colorful syrup bottles + neon-pastel signs
- Pasta-rolling kitchen with wooden pasta-board + drying-rack + Tuscan-window light
- Donut-shop kitchen with frosting buckets + sprinkles rack + pink-tile walls
- Pretzel-bakery kitchen with cast-iron pretzel-shaper + brick wall + warm oven-glow
- Crepe-cart kitchen with round griddle + pastel-glaze bottles + striped awning
- Dim-sum kitchen with bamboo steamer-stack + tea kettle + lantern-glow

Examples:
"A cozy cottage kitchen with copper pots hanging from wooden rafters, butter-yellow walls with floral-pattern tiles, leaded window-light streaming in, dried herb bouquets dangling overhead."
"A French patisserie with pastel-mint cabinets lined with macaron displays, golden chandelier hanging above, marble countertop, soft window-light spilling across pastry-display cases."
"A Japanese sushi-bar with warm cedar counter, paper-lantern glowing overhead, bamboo-screens behind, cherry-blossom branch in a ceramic vase, soft warm interior light."

DO NOT write:
- Foreground characters / foods / chefs (those are in scene_type axis)
- Modern industrial / fast-food / commercial / mall scenes — kawaii cozy cottage / Pop-Mart / Studio-Ghibli register
- Dark / moody / scary / dirty kitchens — bright warm kawaii palette only
- Pathway / lane RECEDING into vanishing point — keep composition clustered

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
