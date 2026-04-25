#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/cute_accessories.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CUTE ACCESSORY descriptions for CoquetteBot — small precious detail items that can stack onto any render. Pearls, ribbons, lace, bows, flower crowns, tiaras. Each entry is a single detail element.

Each entry: 6-14 words. One specific precious accessory.

━━━ CATEGORIES ━━━
- Pearl strands / necklaces (pastel pearl chains, cascading)
- Ribbon bows (huge satin bows, cascading tails)
- Lace trim (delicate Victorian, floral-lace)
- Tiaras (crystal, rose-gold, pearl-studded, tiny floral)
- Flower crowns (wildflower, rose, daisy, peony)
- Satin sashes (wide, pastel, trailing)
- Pearl hair-pins (scattered, rose-motif)
- Butterfly hair-clips (iridescent pastel)
- Rose-brooches (pearl-centered)
- Silk gloves (satin, fingerless, rose-embroidered)
- Pastel parasols (lace-edged, ribbon-tied)
- Beaded chokers (pearl, lace-trim)
- Delicate rings (pearl, rose-gold, tiny floral)
- Rose-shaped earrings (dangling, pastel)
- Lace veils (short, pearl-studded)
- Beaded hair-combs (sparkly, vintage)
- Silk ribbons in hair (multiple, cascading)
- Pastel-feather fans
- Crystal hair-pins
- Satin-bow hair accents
- Tiny rose bouquets (held)
- Velvet chokers with cameo
- Pearl-ankle-bracelets
- Gold-filigree hair-chains
- Flower-studded barrettes

━━━ RULES ━━━
- Small precious detail elements
- Each stacks onto a larger composition
- Pastel / pearl / lace / ribbon palette
- No clothing items (those are garments pool)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
