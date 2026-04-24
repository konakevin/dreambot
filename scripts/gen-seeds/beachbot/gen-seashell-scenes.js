#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/seashell_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SEASHELL + SEAGLASS scene descriptions for BeachBot's seashell path. Each entry frames shells, seaglass, or beach treasures as the SUBJECT in the foreground, with a gorgeous tropical beach as the backdrop. The shell/glass is the hero, the beach is the co-star.

Each entry: 25-40 words. One specific shell/glass arrangement + beach backdrop + light.

━━━ THE CONCEPT ━━━
Close-up to mid-range compositions where seashells, seaglass, or beach treasures are the focal point. Behind them — the most stunning tropical beach imaginable. Think macro-ish photography angle: shells sharp in foreground, beach dreamy behind. The beauty of tiny beach details against epic coastal backdrops.

━━━ SUBJECT TYPES (distribute evenly — dedup by arrangement type) ━━━

SINGLE HERO SHELL (~25%):
- One massive conch shell, pink interior glowing in light, wet sand around it
- Giant nautilus shell spiral catching golden hour light
- Perfect cowrie shell, glossy caramel surface, sitting on volcanic rock
- Large abalone shell, iridescent interior flashing blue-green-purple
- Huge triton trumpet shell, textured spiral, tide pool beside it
- Sun-bleached sand dollar, perfect and whole, on pristine white sand

NATURAL CLUSTERS (~25%):
- Tide line scatter of mixed shells — scallops, clams, whelks, coral bits
- Cluster of tiny shells collected in a rock crevice by waves
- Shells and coral fragments tumbled together at the high-tide mark
- Mixed shells half-buried in wet sand, wave just receding
- Natural pile of shells where current deposits them against driftwood

SEAGLASS (~25%):
- Handful of frosted seaglass pieces — emerald, cobalt, amber — on wet sand
- Single large piece of cobalt blue seaglass catching sunlight, translucent glow
- Collection of sea-tumbled glass shards in a shallow tide pool, colors shimmering
- Rare red and orange seaglass pieces mixed with white and green, on dark volcanic sand
- Frosted seaglass nestled among small pebbles, morning light making them glow

ARRANGED/CURATED (~25%):
- Shells arranged in a spiral pattern on sand, like a beach mandala
- Driftwood piece with shells and seaglass placed along it
- Small collection of beach treasures — shells, seaglass, coral, sea urchin spine — on flat rock
- Heart shape made of tiny shells on wet sand, wave approaching
- Seashells lined up by size on sun-warmed rock, smallest to largest

━━━ BEACH BACKDROP (always gorgeous, vary across entries) ━━━
- Turquoise water with gentle waves behind, out of focus
- Sunset sky blazing orange and pink, silhouetted palms
- Crystal-clear shallow water, white sand, palm shadows
- Volcanic black sand with turquoise water contrast
- Morning mist over calm ocean, soft diffuse light
- Dramatic cliff coastline in the distance behind
- Tide pool foreground, open ocean stretching to horizon

━━━ LIGHT (critical — shells must GLOW) ━━━
- Backlit golden hour making shells translucent and warm
- Wet shells glistening, every texture and color amplified
- Morning soft light, dewy, shells catching first rays
- Seaglass refracting light, prismatic sparkles on sand around it
- Side-light sculpting shell ridges and textures, dramatic shadows

━━━ NO PEOPLE ━━━
No hands, fingers, people holding shells. Shells are found in place — on sand, rock, driftwood, in tide pools.

━━━ DEDUP ━━━
Each entry must feature a DIFFERENT shell type or arrangement. No two entries with the same primary shell species or same arrangement pattern.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
