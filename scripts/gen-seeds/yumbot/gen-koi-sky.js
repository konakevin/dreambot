#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_sky.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} OVERHEAD/CANOPY descriptions for a kawaii Japanese koi-pond scene — what's directly above the pond.

Each entry: 12-22 words. ONE specific overhead.

DO write:
- A cascading wisteria-arch dripping lavender-and-pink blooms overhead
- A canopy of pink cherry-blossom branches with petals raining down
- A wooden pagoda-eave overhanging the pond with paper-lanterns
- A vine-wrapped pergola dripping with hydrangea blooms
- A canopy of bamboo leaves filtering soft dappled light
- Twilight pink-and-lavender sky with chochin-paper-lanterns strung overhead
- A pastel-lavender twilight sky with floating paper-lantern-orbs above
- A canopy of weeping-willow branches trailing gently down
- A magical pink-cloud cluster sky with floating lotus-lanterns rising
- A Japanese-temple roof-edge with curved tile-eaves above the pond
- A canopy of cascading-bougainvillea in pink-and-lavender bloom
- A soft mist-fog hovering low across the canopy line
- A torii-arch silhouette in distance with twilight sky behind
- A canopy of paper-cranes strung on threads overhead
- A pastel-pink dusk sky with crescent-moon and stars softly visible
- A wooden teahouse roof-edge with paper-lanterns strung along eaves
- A wisteria-and-cherry-blossom mixed canopy in lavender and pink
- A canopy of glowing fireflies drifting through cherry-blossom branches
- A magical pastel-sunset sky with floating lotus-shaped lanterns rising
- A canopy of soft pink-cloud puffs with pastel-rainbow at edges

DO NOT write:
- Foreground (creatures, pond surface)
- Modern aircraft / satellites
- Pathway / surface — overhead only
- Dark / scary / stormy sky

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
