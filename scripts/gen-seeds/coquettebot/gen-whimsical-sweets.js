#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/whimsical_sweets.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} WHIMSICAL SWEET / FOOD STILL-LIFE descriptions for CoquetteBot's sweet-treats path — pastel sweets, pastries, tea-time spreads. ZERO humans. Whimsical cute-animal characters (mouse baker, bunny pastry chef, hedgehog with tiny apron) are OK as supporting elements. Can also be pure still-life.

Each entry: 15-30 words. One specific sweet / treat / pastry scene.

━━━ CATEGORIES ━━━
- Macaroon rainbow towers (pastel-stacked, strawberries, edible flowers)
- Pink-frosted layer cakes (rose-petals crowning, pearl dragées)
- Strawberry tarts with rose-glaze
- Afternoon-tea spreads (scones, clotted cream, jam, rose-china)
- Pastel cupcake towers (piped frosting, sprinkles, mini-heart toppers)
- Raspberry petits-fours on silver tray
- Pink hot-chocolate with whipped cream + marshmallow heart
- Pastel French macarons in cardboard box open
- Cherry-blossom daifuku mochi on lacquer tray
- Rose-petal jam jars with tiny scoop
- Cotton-candy-cloud ice-cream cones
- Lemon-peach layer cakes with edible flowers
- Peach-and-cream pavlova with berries
- Pink-champagne flutes with rose in glass
- Bakery-shop window displays (visible from outside, no person)
- Mouse-baker scene (tiny mouse in apron at miniature oven — animal only)
- Bunny pastry-chef in tiny kitchen (animal only)
- Hedgehog tea-party setup with tiny apron (animal only)
- Rose-petal shortbread cooling on rack
- Strawberry-cream tartlet rows
- Pastel doughnut towers with glaze-drips
- Blossom tea in delicate china
- Peach-fizz cocktail setups (garnish detail)
- Bubblegum-pink ice-cream sundaes
- Pink-marble bakery counter displays
- Marzipan-roses atop cake
- Fairy-cake tea-party tableaus (pure still life)
- Rose-jelly in glass dome
- Chocolate-dipped strawberry arrangements (pink drizzle)

━━━ RULES ━━━
- ZERO humans, zero hands, zero chefs, zero human presence
- Cute whimsical animal characters OK (mouse / bunny / hedgehog with apron)
- Or pure still-life food composition
- Pink and pastel palette
- Precious / delicate / cottagecore-bakery

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
