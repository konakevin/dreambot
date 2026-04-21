#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/coquette_garments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COQUETTE GARMENT descriptions for CoquetteBot's adorable-couture path — specific clothing items for fantasy characters. Tulle / lace / silk / pearl / ribbon / bow. Precious + romantic.

Each entry: 8-16 words. One specific garment type with 2-3 detail notes.

━━━ CATEGORIES ━━━
- Tulle gowns (layers of tulle, pastel, princess-silhouette)
- Pearl-ribbon bodices (pearl-studded, lace-trim, satin)
- Butterfly-wing capes (iridescent, petal-like wings, gauzy)
- Rose-embroidered slippers (satin, pearl-detail, delicate)
- Silk-bow sashes (huge sash bows, cascading ribbon tails)
- Flower crowns (wildflowers, roses, baby's breath, tiny blooms)
- Lace gloves (fingerless, floral-lace, satin-ribbon cuffs)
- Feather-edged wraps (ostrich-feather trim, soft blush)
- Chiffon gowns (flowing, gauzy, ankle-length)
- Organza overlays (crystal-pleated, shimmering)
- Ballet tutus (tulle layers, sequin-bodice, satin-ribbon)
- Rose-petal dresses (petal-shaped skirt, romantic)
- Satin slip dresses (delicate straps, lace-hem)
- Corseted bodices (satin-laced, ribbon-tie)
- Veils (lace-edged, cathedral-length, pearl-studded)
- Lace-trim petticoats (peeking beneath skirt)
- Satin-ribbon harnesses (delicate, over slip-dress)
- Bow-embellished bodysuits (ribbon-accents all over)
- Pearl-strung shawls (tassels, beaded)
- Silk-tie neckerchiefs (pastel-print)
- Ribbon-corsets (satin-lacing, heart-shaped neckline)
- Crystal-embellished bodices (scatter-sparkle, subtle)
- Faux-fur shrugs (pastel, soft, winter-coquette)
- Pastel tailored jackets (cream-blazer, satin-lapel)
- Pearl-button gowns (cascading pearl closures)
- Rose-crowns + matching sashes (coordinated)
- Cape-dresses (billowing chiffon with ribbon-bow)

━━━ RULES ━━━
- Pink / pastel palette where color mentioned
- Precious / delicate / romantic
- Each entry 8-16 words describing one garment + details

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
