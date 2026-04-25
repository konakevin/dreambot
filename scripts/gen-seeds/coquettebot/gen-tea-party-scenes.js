#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/tea_party_scenes.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} TEA PARTY ROMANCE scene descriptions for CoquetteBot — impossibly romantic tea parties and garden picnics. No people visible. Pink pastel coquette aesthetic.

Each entry: 10-20 words. One specific tea party or picnic scene.

━━━ CATEGORIES ━━━
- Tea service (vintage teapot pouring, steam rising, bone china cups, sugar tongs)
- Tiered trays (macarons, petit fours, finger sandwiches, scones with clotted cream)
- Garden table setting (lace tablecloth, rose centerpiece, napkin rings, crystal)
- Picnic blanket (gingham + linen on grass, strawberry basket, champagne flutes)
- Conservatory tea (glass ceiling, tropical plants, iron table, afternoon light)
- Cake stands (single-tier with Victoria sponge, fondant roses, pearl dragées)
- Flower arrangements (peonies + roses in silver urn, scattered petals on cloth)
- Dessert displays (éclairs on doily, cream puffs pyramid, fruit tarts in row)
- Garden backdrop (wisteria arbor overhead, rose hedge, fountain in distance)
- Strawberry + cream (bowl of berries, whipped cream dollop, silver spoon, lace)
- Vintage china patterns (floral rim teacup close-up, gold edge, matching saucer)
- Honey + preserves (crystal honey pot, jam jars with gingham lids, butter dish)
- Champagne details (crystal coupe glasses, bubbles catching light, ribbon on stem)
- Morning garden (dew on rose petals, empty chairs waiting, table set for two)

━━━ RULES ━━━
- NO people, NO hands, NO figures
- Pink/cream/rose-gold/soft-green garden palette
- Food + china + flowers as heroes
- Outdoor or conservatory settings preferred

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
