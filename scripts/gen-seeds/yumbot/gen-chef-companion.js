#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_companion.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TINY KITCHEN COMPANION elements for a kawaii mini-chef scene. Each entry is ONE small peripheral cute creature or kitchen-helper accent that hovers/sits near the chef-foods.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny smiling sugar-mouse with a chef-hat hovering nearby
- A small kawaii dough-spirit with floury puff-cheeks
- A tiny smiling-spice-fairy with a paprika-red dress
- A small kawaii butter-stick with a smiling face leaning against the bowl
- A tiny kawaii whisk-creature with bristle-arms
- A small kawaii sugar-snowflake with a kawaii face drifting through air
- A tiny smiling cinnamon-stick rolling on the counter
- A small kawaii baking-fairy in apron and chef-hat
- A tiny smiling tomato-pixie with leaf-wings
- A small kawaii cookie-cutter spirit with smiling face
- A tiny smiling vanilla-bean character with hands clasped
- A small kawaii sourdough-starter in a jar with smiling face
- A tiny kawaii salt-shaker with a smiling face perched on the counter
- A small smiling rolling-pin character standing upright
- A tiny smiling honey-bee with a kawaii face
- A small kawaii batter-blob with a smiling face nestled on the counter
- A tiny smiling-flour-cloud floating through the air
- A small kawaii oven-mitt creature with smiling face
- A tiny smiling milk-carton with a kawaii face on the side
- A small kawaii sprinkle-fairy in pastel-rainbow dress

DO NOT write:
- Human characters / chibi figures
- Foods that should be in food_inhabitants (full kawaii chef-foods)
- Modern objects
- Large landscape / kitchen elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
