#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/coastal_scenes.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} COASTAL COQUETTE scene/fashion descriptions for CoquetteBot — beach and poolside scenes filtered through pink pastel coquette aesthetic. Each describes a specific beach/pool fashion moment or setting.

Each entry: 10-20 words. One specific coastal coquette scene or outfit moment.

━━━ FASHION CATEGORIES (mix across all entries) ━━━
- Bikinis (pastel pink string bikini with pearl details, ruffled lavender halter top, shell-embellished bandeau)
- One-pieces (scalloped-edge blush swimsuit, bow-back maillot, pearl-button retro one-piece)
- Coverups (sheer lace beach kaftan, crochet mini dress, oversized linen shirt in cream)
- Sarongs (silk floral wrap, chiffon pareo in sunset ombré, tied at the hip with ribbon)
- Beach dresses (flowy sundress in pastel stripe, off-shoulder cotton in pink gingham, eyelet lace mini)
- Resort wear (wide-leg linen pants with crop top, matching set in shell print, palazzo jumpsuit)

━━━ SETTING CATEGORIES (mix across all entries) ━━━
- Pink sand beach (blush-toned sand, gentle turquoise waves, sunset light)
- Beach picnic (gingham blanket on sand, wicker basket, champagne flutes, fruit, flowers)
- Poolside lounge (pink inflatable flamingo, floral pool float, tiled pool edge, cocktail)
- Beach cabana (draped white curtains, daybed with silk cushions, ocean view)
- Seaside café (pastel-painted chairs, ocean backdrop, iced drink with straw, straw hat on table)
- Boardwalk (cotton candy, carnival lights, pier at sunset, ice cream cone)
- Yacht deck (white cushions, champagne, trailing silk scarf in the breeze)
- Tidal pool (perched on rocks, shells arranged, tide washing in, starfish)
- Garden pool (rose bushes around pool, stone patio, vintage lounger, parasol)
- Sunset shoreline (golden-hour glow, waves at ankles, wind in hair, shell necklace)

━━━ ACCESSORY DETAILS (sprinkle across entries) ━━━
- Shell jewelry (cowrie necklace, pearl anklet, shell earrings, coral bracelet)
- Straw accessories (wide-brim sun hat with ribbon, woven beach bag, raffia slides)
- Sunglasses (heart-shaped in pink, cat-eye in pearl, oversized round in cream)
- Hair accessories (silk scarf headband, flower tucked behind ear, pearl hair clips)
- Beach bags (wicker basket with bow, canvas tote with embroidery, straw clutch)

━━━ RULES ━━━
- 60% fashion moments (girl in specific outfit + setting), 40% pure scene (no people)
- For fashion entries: describe the OUTFIT + what she's doing + where
- For scene entries: describe the setting with coquette details, no people
- Pink/pastel/cream/gold palette always — even the ocean looks pastel
- Beach is ROMANTIC and PRETTY, never sporty or athletic
- Coastal coquette Pinterest energy throughout

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
