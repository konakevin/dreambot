#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_sky.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} OVERHEAD/CEILING descriptions for a kawaii coquette food-party scene — what's directly above.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 12-22 words. ONE specific overhead.

DO write:
- A cascading shower of pink heart-shaped balloons drifting overhead
- A canopy of cherry-blossom branches in pink bloom over the scene
- A pink-pearl chandelier with cascading crystal droplets glittering above
- Strings of pink ribbon-bunting in cascading streamers crossing overhead
- A pink-lavender wisteria-arch dripping blossoms downward
- A canopy of pink-pearl-strands suspended in shimmering curtain
- Cascading pink rose-garlands draped from ceiling beams
- A vintage white-lace canopy with pink-rose embroidered detail
- A pink-tulle gathered ceiling-treatment with pearl-trim edging
- A field of pink heart-shaped paper-lanterns strung overhead
- A canopy of lavender wisteria-blooms dripping fragrantly downward
- A pink-cream rococo-ceiling with painted clouds and pearl-frame medallions
- A pink-pearl floating-orbs cluster suspended in mid-air above
- A swag of pink-satin draperies pulled back with pearl-rope ties
- A canopy of pink-rose petals raining downward in slow drift
- A pink-pastel hot-air-balloon-cluster floating gently above
- A cascade of pink-pearl-strands flowing down from a chandelier
- A pink-tulle bow-bunting hanging across the ceiling in cheerful arcs
- A canopy of pink-feathers gently floating overhead in dreamy drift
- A pink-pastel ribbon-mobile spinning slowly overhead with charm-trinkets

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Foreground (foods / characters / surface)
- Real text / kanji
- Dark / scary / moody overhead

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
