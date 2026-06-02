#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_details.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY-INTERIOR DETAILS for ChibiBot cozy-interior — the tiny lived-in objects/features that POPULATE a cozy room. Each render picks 3 (pickN:3).

Each entry: 8-15 words. ONE specific cozy-interior detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% TEXTILE (chunky cable-knit blanket draped over chair / sheepskin throw on a stool / patchwork quilt half-folded on bed / lace doily under a lamp / floral cushion piled in a corner)
- 15% READING-CODED (stack of dog-eared paperbacks / open book face-down on an armrest / bookshelf with leather-bound spines / globe on a wooden stand / framed botanical prints)
- 15% KITCHEN-CODED (steaming ceramic mug / kettle on a stove / glass jar of cookies / sliced lemon on a wooden board / wooden cutting board with breadcrumbs)
- 10% LIGHTING (brass hurricane lamp with warm yellow glow / paper lantern hung in a corner / candle in a glass jar / fairy-lights strung along a beam / oil lamp on a side table)
- 10% PLANT-LIFE (monstera trailing from a windowsill / hanging fern in a macrame holder / row of herb pots on a sill / small bonsai on a corner table / dried-flower bouquet in a vase)
- 10% MUSIC / HOBBY (vinyl record on a turntable / half-finished knitting on an armrest / open sketchbook / acoustic guitar leaning against the wall / sewing-basket overflowing)
- 10% WALL-ART (framed pressed-flowers / vintage map on a wall / illustrated nursery-rhyme prints / family photo cluster / paper-cutout silhouette)
- 5% SCENT-CODED (incense burner with smoke / bowl of dried lavender / cinnamon-stick jar / orange-peel and clove sachet)
- 5% HEARTH (cast-iron poker leaning against the hearth / kindling-bundle in a brass holder / log-basket / hearth-rug)

━━━ HARD BANS ━━━

- NO creatures
- NO time / weather
- NO activity verbs

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
