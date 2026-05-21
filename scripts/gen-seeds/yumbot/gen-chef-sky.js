#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_sky.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} OVERHEAD/CEILING descriptions for a kawaii mini-chef kitchen scene. Each entry describes what's overhead — kitchen ceiling, hanging utensils, lighting fixtures, windows-above.

Each entry: 12-22 words. ONE specific overhead description.

DO write:
- Wooden rafters with copper pots and pans hanging on hooks above the kitchen
- Dried herb bundles tied with twine hanging from wooden beams overhead
- A pastel chandelier with kawaii-bear bulbs softly glowing
- Wooden ceiling beams with strings of dried garlic and chili-peppers hanging
- A skylight ceiling letting golden sunlight pour down onto the counter
- A row of pastel-globe pendant-lights hanging at varying heights overhead
- A row of hanging copper saucepans with warm-glow reflections
- A wooden pot-rack with cast-iron skillets and a vintage kettle hanging
- Stained-glass cabinet doors high on the wall catching colored light from above
- A row of vintage milk-pitchers hanging on hooks across a wooden bar overhead
- A floral chandelier strung with hanging tulip-shaped bulbs
- A kitchen ceiling with exposed brick arches and warm pendant-lights
- A wooden beam ceiling with hanging baskets of herbs and dried flowers
- A ceiling of stamped-tin tiles in pastel-cream with chandelier centered
- Strings of warm fairy-lights woven across the ceiling beams
- A row of mason-jar pendant-lights with soft warm glow each
- A wooden rafter overhead with strings of dried mushrooms and onions hanging
- A skylight in the ceiling letting cherry-blossom petals drift through
- A wide kitchen-window high overhead with garden-view beyond
- A vaulted wooden ceiling with a single pastel pendant-light at center

DO NOT write:
- Foreground (foods, characters, counter)
- Outdoor sky (this is INDOOR kitchen — ceiling/overhead only, unless explicitly a skylight or window)
- Modern fluorescent / strip-lights — kawaii warm pendant / chandelier / rafter aesthetic
- Pathway / receding surface — overhead only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
