#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_sky.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} OVERHEAD/SKY descriptions for a kawaii Japanese matsuri (festival) scene. Each entry describes ONLY what's overhead — the sky, lantern canopy, festival decorations above the scene.

Each entry: 12-22 words. ONE specific overhead description.

DO write:
- A dense canopy of glowing chochin paper-lanterns strung between bamboo poles overhead in warm orange-gold rows
- A cascade of pastel-rainbow paper-streamers crisscrossing above with bunting flags
- A sakura-petal canopy raining down in pastel pink drift
- Autumn maple-leaves swirling in gold-and-crimson drift above
- A festival-banner canopy of red-white-and-indigo paper banners
- A starry indigo night sky with chrysanthemum-burst fireworks above
- A soft pastel twilight sky in peach-and-lavender gradients
- A glowing paper-lantern arch overhead with fireflies drifting between
- A bamboo-grove canopy with leaf-shadows dappling everything below
- A wooden temple-roof overhang with red-vermilion eaves and curving tiles
- A sky filled with golden festival-lantern bokeh and floating sparkle-orbs
- A canopy of cherry-blossom branches with paper-lanterns strung between
- A constellation of paper-doll wind-streamers spinning above
- A field of paper-stars hanging on red threads overhead
- A soft warm sunset gradient with chochin lanterns silhouetted
- A canopy of bamboo windbells (furin) tinkling overhead
- A pastel paper-arch with bunting and dangling tassels
- A drifting cloud of glowing fireflies above wooden eaves
- A sky of floating paper lanterns released into the warm dusk
- An open shrine-courtyard sky with distant fireworks softly blooming

DO NOT write:
- Foreground (foods, characters, ground)
- Modern aircraft, satellites, drones, billboards
- Real kanji / Japanese-text characters — keep all signage as decorative-pattern
- Pathway / lane / receding ground — overhead only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
