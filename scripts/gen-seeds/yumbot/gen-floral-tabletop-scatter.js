#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_tabletop_scatter.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} TABLETOP-SCATTER elements for YumBot floral-garden-cup. Small details scattered on the surface around the base of the vessel. Template picks 3 per render.

Each entry: 8-15 words. ONE specific tabletop scatter piece.

━━━ REFERENCE — bex.ai ━━━

Small pastel pearl-beads, mini-berries (blueberry / raspberry / cranberry / strawberry), loose flower-petals, sphere-pebbles, small floral-balls, mini-sphere-fruits.

━━━ DISTRIBUTION ━━━

- 25% PEARL-BEADS / SUGAR-ORBS (cluster of pastel pearl-beads scattered / pastel-cream pearl-balls / iridescent sphere-beads pile)
- 20% MINI-BERRIES (cluster of pastel-pink raspberries / scattered blueberries / pearl-cranberries / dewy mini-strawberries / tiny pastel-cherries)
- 15% LOOSE PETALS (scattered cherry-blossom-petals / loose pastel-rose-petals / drifting peony-petals / soft cream-petals)
- 10% SMALL FLORAL-BALLS (mini pastel pom-poms scattered / tiny sphere-flower-buds / small dahlia-puffs)
- 10% MINI-SPHERE-FRUITS (cluster of pastel-grapes / mini-spherical-currants / pearl-citrus / mini-pastel-figs)
- 5% LEAVES / SPRIGS (scattered mint-leaves / loose silver-leaves / tiny eucalyptus-sprigs)
- 5% CRYSTALS / GEMS (pastel crystal-shards scattered / small pastel gemstones / iridescent stones)
- 5% MARSHMALLOWS / SUGAR (pastel marshmallow-cluster / sugar-pearl-scatter / small candy-orbs)
- 5% MISC SMALL (tiny acorn-cap cluster / pastel buttons / mini ribbon-pieces / scattered pollen-dust)

━━━ HARD MANDATES ━━━

- Always CLUSTERED or scattered-multiple (NOT solo singletons)
- Pastel palette
- Painterly subtle texture

━━━ HARD BANS ━━━

- NO creatures / animals / humans
- NO vessel / flowers (covered by other pools)
- NO modern objects (tech / phones / coins)

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
